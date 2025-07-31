const User = require('../Models/User');

// Add or update user points
exports.getPoints = async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ message: 'username and email are required.' });
    }
    
    console.log('Getting points for user:', { username, email });
    
    // Find user or create if not exists
    let user = await User.findOne({ username, email });
    if (!user) {
      user = new User({ username, email, points: 0 });
      await user.save();
      console.log('Created new user with 0 points');
    } else {
      console.log('Found existing user with points:', user.points);
    }
    
    res.json({ message: 'Points fetched successfully', points: user.points });
  } catch (err) {
    console.log('Error in getPoints:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addPoints = async (req, res) => {
  try {
    const { username, email, increment = 1 } = req.body; // Default increment of 1
    if (!username || !email) {
      return res.status(400).json({ message: 'username and email are required.' });
    }
    
    console.log('Adding points for user:', { username, email, increment });
    
    // Find user or create if not exists
    let user = await User.findOne({ username, email });
    if (!user) {
      user = new User({ username, email, points: 0 });
      console.log('Created new user with 0 points');
    } else {
      console.log('Found existing user with points:', user.points);
    }
    
    // Add points (default increment is 1)
    user.points += increment;
    await user.save();
    
    console.log('Updated user points to:', user.points);
    
    res.json({ message: 'Points updated successfully', points: user.points });
  } catch (err) {
    console.log('Error in addPoints:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Check if user has a free download left for today
exports.hasFreeDownloadToday = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      console.log('hasFreeDownloadToday: email is missing');
      return res.status(400).json({ 
        message: 'email is required.', 
        free: false, 
        isPremium: false 
      });
    }
    
    console.log('hasFreeDownloadToday: checking for email:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('hasFreeDownloadToday: user not found, creating new user');
      // Create new user if not found
      const newUser = new User({ 
        email, 
        username: email.split('@')[0], // Use email prefix as username
        points: 0,
        downloads: [],
        isPremium: false
      });
      await newUser.save();
      
      return res.json({ 
        free: true, 
        isPremium: false,
        message: 'New user created with free download'
      });
    }
    
    console.log('hasFreeDownloadToday: found user, checking premium status');
    
    // Check if premium has expired
    if (user.isPremium && user.premiumExpiry && new Date() > user.premiumExpiry) {
      console.log('hasFreeDownloadToday: premium expired, updating user');
      user.isPremium = false;
      user.premiumExpiry = null;
      await user.save();
    }
    
    // Premium users get unlimited downloads
    if (user.isPremium) {
      console.log('hasFreeDownloadToday: user is premium, allowing download');
      return res.json({ 
        free: true, 
        isPremium: true,
        message: 'Premium user - unlimited downloads'
      });
    }
    
    console.log('hasFreeDownloadToday: user is not premium, checking daily downloads');
    
    // Free users get 1 download per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Ensure downloads array exists
    if (!user.downloads) {
      user.downloads = [];
    }
    
    const downloadsToday = user.downloads.filter(d => {
      if (!d.date) return false;
      const dDate = new Date(d.date);
      dDate.setHours(0, 0, 0, 0);
      return dDate.getTime() === today.getTime();
    });
    
    const hasFreeDownload = downloadsToday.length < 1;
    console.log('hasFreeDownloadToday: downloads today:', downloadsToday.length, 'hasFreeDownload:', hasFreeDownload);
    
    res.json({ 
      free: hasFreeDownload, 
      isPremium: false,
      downloadsToday: downloadsToday.length,
      message: hasFreeDownload ? 'Free download available' : 'No free downloads left today'
    });
    
  } catch (err) {
    console.error('hasFreeDownloadToday error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message, 
      free: false, 
      isPremium: false 
    });
  }
};

// Record a download for a user
exports.recordDownload = async (req, res) => {
  try {
    const { email, videoId } = req.body;
    
    if (!email || !videoId) {
      console.log('recordDownload: missing email or videoId');
      return res.status(400).json({ 
        message: 'email and videoId are required.',
        received: { email: !!email, videoId: !!videoId }
      });
    }
    
    console.log('recordDownload: recording download for:', { email, videoId });
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('recordDownload: user not found, creating new user');
      // Create new user if not found
      const newUser = new User({ 
        email, 
        username: email.split('@')[0],
        points: 0,
        downloads: [{ date: new Date(), videoId }],
        isPremium: false
      });
      await newUser.save();
      
      return res.json({ 
        message: 'Download recorded for new user.',
        downloadsToday: 1
      });
    }
    
    // Ensure downloads array exists
    if (!user.downloads) {
      user.downloads = [];
    }
    
    // Add the download record
    user.downloads.push({ date: new Date(), videoId });
    await user.save();
    
    // Count downloads for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const downloadsToday = user.downloads.filter(d => {
      if (!d.date) return false;
      const dDate = new Date(d.date);
      dDate.setHours(0, 0, 0, 0);
      return dDate.getTime() === today.getTime();
    });
    
    console.log('recordDownload: download recorded successfully, downloads today:', downloadsToday.length);
    
    res.json({ 
      message: 'Download recorded successfully.',
      downloadsToday: downloadsToday.length
    });
    
  } catch (err) {
    console.error('recordDownload error:', err);
    res.status(500).json({ 
      message: 'Server error', 
      error: err.message 
    });
  }
};

// Activate premium plan for a user
exports.activatePremium = async (req, res) => {
  try {
    const { email, duration = 30 } = req.body; // duration in days, default 30 days
    if (!email) return res.status(400).json({ message: 'email is required.' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    // Set premium status and expiry date
    user.isPremium = true;
    user.premiumExpiry = new Date(Date.now() + duration * 24 * 60 * 60 * 1000); // Add days to current date
    await user.save();
    
    res.json({ 
      message: 'Premium plan activated successfully', 
      isPremium: user.isPremium,
      premiumExpiry: user.premiumExpiry 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Check premium status
exports.checkPremiumStatus = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email is required.' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    
    // Check if premium has expired
    if (user.isPremium && user.premiumExpiry && new Date() > user.premiumExpiry) {
      user.isPremium = false;
      user.premiumExpiry = null;
      await user.save();
    }
    
    res.json({ 
      isPremium: user.isPremium,
      premiumExpiry: user.premiumExpiry 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 