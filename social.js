window.SocialManager = {
  // Boost system
  boosts: {
    production: { active: false, multiplier: 2.0, duration: 300, remaining: 0 },
    growth: { active: false, multiplier: 1.5, duration: 300, remaining: 0 },
    efficiency: { active: false, multiplier: 1.3, duration: 300, remaining: 0 }
  },
  
  // Player stats
  playerStats: {
    totalHarvested: 0,
    contractsCompleted: 0,
    upgradesPurchased: 0,
    playTime: 0,
    lastSaveTime: 0
  },
  
  // Initialize social features
  init() {
    this.loadPlayerStats();
    this.startPlayTimeTracking();
  },
  
  // Activate boost
  activateBoost(boostType) {
    if (this.boosts[boostType] && !this.boosts[boostType].active) {
      this.boosts[boostType].active = true;
      this.boosts[boostType].remaining = this.boosts[boostType].duration;
      
      console.log(`${boostType} boost activated! Multiplier: ${this.boosts[boostType].multiplier}x`);
      this.showBoostNotification(boostType);
      
      return true;
    }
    return false;
  },
  
  // Get current boost multiplier
  getBoostMultiplier(boostType) {
    const boost = this.boosts[boostType];
    return boost && boost.active ? boost.multiplier : 1.0;
  },
  
  // Update boost timers
  updateBoosts() {
    Object.keys(this.boosts).forEach(boostType => {
      const boost = this.boosts[boostType];
      if (boost.active && boost.remaining > 0) {
        boost.remaining--;
        if (boost.remaining <= 0) {
          boost.active = false;
          console.log(`${boostType} boost expired!`);
          this.showBoostExpiredNotification(boostType);
        }
      }
    });
  },
  
  // Show boost notification
  showBoostNotification(boostType) {
    const notification = document.createElement('div');
    notification.className = 'boost-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h4>🚀 Boost Activated!</h4>
        <p>${boostType.charAt(0).toUpperCase() + boostType.slice(1)} Boost</p>
        <p>${this.boosts[boostType].multiplier}x Multiplier</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  },
  
  // Show boost expired notification
  showBoostExpiredNotification(boostType) {
    const notification = document.createElement('div');
    notification.className = 'boost-expired-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h4>⏰ Boost Expired</h4>
        <p>${boostType.charAt(0).toUpperCase() + boostType.slice(1)} Boost has ended</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  },
  
  // Update player stats
  updateStats(statType, value = 1) {
    if (this.playerStats[statType] !== undefined) {
      this.playerStats[statType] += value;
      this.savePlayerStats();
    }
  },
  
  // Start play time tracking
  startPlayTimeTracking() {
    this.playerStats.lastSaveTime = now();
    setInterval(() => {
      this.playerStats.playTime += 1;
      if (this.playerStats.playTime % 60 === 0) { // Save every minute
        this.savePlayerStats();
      }
    }, 1000);
  },
  
  // Save player stats
  savePlayerStats() {
    try {
      localStorage.setItem('harvestHearth_stats', JSON.stringify(this.playerStats));
    } catch (error) {
      console.log('Failed to save player stats:', error);
    }
  },
  
  // Load player stats
  loadPlayerStats() {
    try {
      const saved = localStorage.getItem('harvestHearth_stats');
      if (saved) {
        this.playerStats = { ...this.playerStats, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.log('Failed to load player stats:', error);
    }
  },
  
  // Render social panel
  render() {
    const p = document.getElementById('social-panel');
    if (!p) return;
    
    const activeBoosts = Object.keys(this.boosts).filter(type => this.boosts[type].active);
    const readyPlots = MapManager.grid.filter(p => p.status === "ready").length;
    const debuffedSilos = ['wheat', 'flour', 'bread', 'corn', 'popcorn'].filter(id => SiloManager[id].debuff).length;
    
    p.innerHTML = `
      <h3>Social & Boosts</h3>
      <div class="boost-section">
        <h4>Active Boosts</h4>
        ${activeBoosts.length > 0 ? 
          activeBoosts.map(type => `
            <div class="boost-item">
              <span>${type.charAt(0).toUpperCase() + type.slice(1)}: ${this.boosts[type].multiplier}x</span>
              <span>⏳ ${this.boosts[type].remaining}s</span>
            </div>
          `).join('') : 
          '<p>No active boosts</p>'
        }
      </div>
      <div class="stats-section">
        <h4>Player Stats</h4>
        <div>Total Harvested: ${this.playerStats.totalHarvested}</div>
        <div>Contracts: ${this.playerStats.contractsCompleted}</div>
        <div>Upgrades: ${this.playerStats.upgradesPurchased}</div>
        <div>Play Time: ${Math.floor(this.playerStats.playTime / 60)}m ${this.playerStats.playTime % 60}s</div>
      </div>
      <div class="debug-section">
        <h4>Debug Info</h4>
        <div>Ready Plots: ${readyPlots}</div>
        <div>Debuffed Silos: ${debuffedSilos}</div>
        <div>Active Boosts: ${activeBoosts.length}</div>
      </div>
      <div class="boost-controls">
        <button onclick="SocialManager.activateBoost('production')" class="boost-btn">🚀 Production Boost</button>
        <button onclick="SocialManager.activateBoost('growth')" class="boost-btn">🌱 Growth Boost</button>
        <button onclick="SocialManager.activateBoost('efficiency')" class="boost-btn">⚡ Efficiency Boost</button>
      </div>
    `;
  }
}; 