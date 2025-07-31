const express = require('express');
const Drive = require('../models/Drive');
const Interest = require('../models/Interest');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all drives with filters
router.get('/', async (req, res) => {
  try {
    const { city, jobCategories, skills, experience, page = 1, limit = 10 } = req.query;
    
    let filter = { status: 'active', date: { $gte: new Date() } };
    
    // Apply filters
    if (city) {
      filter['location.city'] = new RegExp(city, 'i');
    }
    
    if (jobCategories) {
      const categories = jobCategories.split(',');
      filter.jobCategories = { $in: categories };
    }
    
    if (skills) {
      const skillsArray = skills.split(',');
      filter.specificSkills = { $in: skillsArray };
    }
    
    if (experience) {
      const expArray = experience.split(',');
      filter.experienceLevel = { $in: expArray };
    }
    
    const drives = await Drive.find(filter)
      .populate('companyId', 'companyName contactNumber')
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Drive.countDocuments(filter);
    
    res.json({
      drives,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single drive
router.get('/:id', async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate('companyId', 'companyName companyDescription contactNumber website');
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }
    
    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new drive (Company only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ message: 'Only companies can create drives' });
    }
    
    const drive = new Drive({
      ...req.body,
      companyId: req.userId
    });
    
    await drive.save();
    await drive.populate('companyId', 'companyName contactNumber');
    
    res.status(201).json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update drive (Company only)
router.put('/:id', auth, async (req, res) => {
  try {
    const drive = await Drive.findOne({ 
      _id: req.params.id, 
      companyId: req.userId 
    });
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found or unauthorized' });
    }
    
    Object.assign(drive, req.body);
    await drive.save();
    
    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get company's drives
router.get('/company/my-drives', auth, async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const drives = await Drive.find({ companyId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;