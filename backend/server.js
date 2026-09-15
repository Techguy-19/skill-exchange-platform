const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())


function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: 'Access denied. Please login.'
    })
  }

  const token = authHeader.split(' ')[1]

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)

    req.user = user

    next()
  } catch (error) {
    return res.status(403).json({
      error: 'Invalid or expired token'
    })
  }
}


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

app.get('/', (req, res) => {
  res.send('Skill Exchange Platform Backend is running!')
})

app.get('/api/skills', async (req, res) => {
  const { data, error } = await supabase
    .from('skills')
    .select(`
      id,
      user_id,
      name,
      category,
      description,
      created_at,
      user:users (
        id,
        name,
        email
      )
    `)

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.json(data)
})


app.get('/api/requests', authenticateToken, async (req, res) => {
  const user_id = req.user.id

  const { data, error } = await supabase
    .from('exchange_requests')
    .select(`
      id,
      status,
      created_at,
      sender:sender_id (
        id,
        name,
        email
      ),
      receiver:receiver_id (
        id,
        name,
        email
      ),
      offered_skill:offered_skill_id (
        id,
        name,
        category
      ),
      requested_skill:requested_skill_id (
        id,
        name,
        category
      )
    `)
    .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.json(data)
})

app.delete('/api/skills/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const user_id = req.user.id

  const { data, error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id)
    .select()

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      error: 'Skill not found or you are not the owner'
    })
  }

  res.json({
    message: 'Skill deleted successfully'
  })
})

app.put('/api/skills/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { name, category, description } = req.body
  const user_id = req.user.id

  if (!name || !category || !description) {
    return res.status(400).json({
      error: 'All fields are required'
    })
  }

  const { data, error } = await supabase
    .from('skills')
    .update({
      name,
      category,
      description
    })
    .eq('id', id)
    .eq('user_id', user_id)
    .select()

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      error: 'Skill not found or you are not the owner'
    })
  }

  res.json(data[0])
})

app.post('/api/skills', authenticateToken, async (req, res) => {
  const { name, category, description } = req.body
  const user_id = req.user.id

  if (!name || !category || !description) {
    return res.status(400).json({
      error: 'All fields are required'
    })
  }

  const { data, error } = await supabase
    .from('skills')
    .insert([
      {
        user_id,
        name,
        category,
        description
      }
    ])
    .select()

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.status(201).json(data[0])
})


app.post('/api/requests', authenticateToken, async (req, res) => {
  const { receiver_id, offered_skill_id, requested_skill_id } = req.body
  const sender_id = req.user.id

  if (!receiver_id || !offered_skill_id || !requested_skill_id) {
    return res.status(400).json({
      error: 'All fields are required'
    })
  }

  // Check whether the offered skill belongs to the logged-in user
  const { data: offeredSkill, error: offeredSkillError } = await supabase
    .from('skills')
    .select('id, user_id')
    .eq('id', offered_skill_id)
    .single()

  if (offeredSkillError || !offeredSkill) {
    return res.status(404).json({
      error: 'Offered skill not found'
    })
  }

  if (offeredSkill.user_id !== sender_id) {
    return res.status(403).json({
      error: 'You can only offer your own skill'
    })
  }

  // Check whether the requested skill belongs to the receiver
  const { data: requestedSkill, error: requestedSkillError } = await supabase
    .from('skills')
    .select('id, user_id')
    .eq('id', requested_skill_id)
    .single()

  if (requestedSkillError || !requestedSkill) {
    return res.status(404).json({
      error: 'Requested skill not found'
    })
  }

  if (requestedSkill.user_id !== receiver_id) {
    return res.status(403).json({
      error: 'Requested skill does not belong to this user'
    })
  }

  // Prevent sending a request to yourself
  if (sender_id === receiver_id) {
    return res.status(400).json({
      error: 'You cannot send a request to yourself'
    })
  }

  const { data, error } = await supabase
    .from('exchange_requests')
    .insert([
      {
        sender_id,
        receiver_id,
        offered_skill_id,
        requested_skill_id,
        status: 'pending'
      }
    ])
    .select()

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.status(201).json(data[0])
})
app.get('/api/requests', authenticateToken, async (req, res) => {
  const user_id = req.user.id

  const { data, error } = await supabase
    .from('exchange_requests')
    .select('*')
    .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  res.json(data)
})

app.put('/api/requests/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({
      error: 'Invalid status'
    })
  }

  const { data, error } = await supabase
    .from('exchange_requests')
    .update({
      status
    })
    .eq('id', id)
    .eq('receiver_id', req.user.id)
    .select()

  if (error) {
    return res.status(500).json({
      error: error.message
    })
  }

  if (!data || data.length === 0) {
    return res.status(404).json({
      error: 'Request not found or you are not the receiver'
    })
  }

  res.json(data[0])
})

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'All fields are required'
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters'
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name,
        email,
        password_hash: hashedPassword
      }
    ])
    .select('id, name, email, created_at')

  if (error) {
    return res.status(400).json({
      error: 'Email may already be registered'
    })
  }

  const user = data[0]

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d'
    }
  )

  res.status(201).json({
    message: 'Registration successful',
    token,
    user
  })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    })
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !data) {
    return res.status(401).json({
      error: 'Invalid email or password'
    })
  }

  const passwordMatch = await bcrypt.compare(password, data.password_hash)

  if (!passwordMatch) {
    return res.status(401).json({
      error: 'Invalid email or password'
    })
  }

  const token = jwt.sign(
    {
      id: data.id,
      email: data.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d'
    }
  )

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: data.id,
      name: data.name,
      email: data.email
    }
  })
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`)
})