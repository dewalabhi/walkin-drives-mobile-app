const express = require('express');
const Interest = require('../models/Interest');
const Drive = require('../models/Drive');
const auth = require('../middleware/auth');

const router = express.Router();

// Express interest in a drive
router.post('/:driveId', auth, async (req, res) => {
  try {
    if (req.userType !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can express interest' });
    }
    
    const driveId = req.params.driveId;
    const candidateId = req.userId;
    
    // Check if drive exists and is active
    const drive = await Drive.findOne({
      _id: driveId,
      status: 'active',
      date: { $gte: new Date() }
    });
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found or inactive' });
    }
    
    // Check if already interested
    const existingInterest = await Interest.findOne({
      candidateId,
      driveId,
      status: 'interested'
    });
    
    if (existingInterest) {
      return res.status(400).json({ message: 'Already expressed interest' });
    }
    
    // Create interest
    const interest = new Interest({
      candidateId,
      driveId,
      status: 'interested'
    });
    
    await interest.save();
    
    // Update drive interested count
    await Drive.findByIdAndUpdate(driveId, {
      $inc: { currentInterested: 1 }
    });
    
    res.status(201).json({ message: 'Interest expressed successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already expressed interest' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Withdraw interest
router.delete('/:driveId', auth, async (req, res) => {
  try {
    const interest = await Interest.findOneAndUpdate(
      {
        candidateId: req.userId,
        driveId: req.params.driveId,
        status: 'interested'
      },
      { status: 'withdrawn' },
      { new: true }
    );
    
    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }
    
    // Update drive interested count
    await Drive.findByIdAndUpdate(req.params.driveId, {
      $inc: { currentInterested: -1 }
    });
    
    res.json({ message: 'Interest withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get candidate's interested drives
router.get('/my-interests', auth, async (req, res) => {
  try {
    if (req.userType !== 'candidate') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const interests = await Interest.find({
      candidateId: req.userId,
      status: 'interested'
    })
    .populate({
      path: 'driveId',
      populate: {
        path: 'companyId',
        select: 'companyName'
      }
    })
    .sort({ createdAt: -1 });
    
    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get interested candidates for a drive (Company only)
router.get('/drive/:driveId/candidates', auth, async (req, res) => {
  try {
    if (req.userType !== 'company') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Verify company owns this drive
    const drive = await Drive.findOne({
      _id: req.params.driveId,
      companyId: req.userId
    });
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found or unauthorized' });
    }
    
    const interests = await Interest.find({
      driveId: req.params.driveId,
      status: 'interested'
    })
    .populate('candidateId', 'fullName phone email skills experience location')
    .sort({ createdAt: -1 });
    
    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if candidate has expressed interest in a drive
router.get('/check/:driveId', auth, async (req, res) => {
  try {
    if (req.userType !== 'candidate') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const interest = await Interest.findOne({
      candidateId: req.userId,
      driveId: req.params.driveId,
      status: 'interested'
    });
    
    res.json({ hasInterest: !!interest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;