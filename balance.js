window.GameBalance = {
  // Crop settings (now managed by CropManager)
  crops: {
    wheat: { 
      growTime: 8,
      emoji: "🌾", 
      yield: 2,
      baseValue: 1
    },
    corn: {
      growTime: 12,
      emoji: "🌽",
      yield: 3,
      baseValue: 2
    }
  },
  
  // Machine processing times
  machines: {
    mill: {
      procTime: 6,
      inputAmount: 2,
      outputAmount: 1,
      efficiency: 1.0
    },
    bakery: {
      procTime: 10,
      inputAmount: 2,
      outputAmount: 1,
      efficiency: 1.0
    },
    popper: {
      procTime: 8,
      inputAmount: 3,
      outputAmount: 2,
      efficiency: 1.0
    }
  },
  
  // Silo bandwidth settings
  silos: {
    wheat: { baseBandwidth: 100, upgradeIncrease: 40 },
    flour: { baseBandwidth: 80, upgradeIncrease: 30 },
    bread: { baseBandwidth: 60, upgradeIncrease: 20 },
    corn: { baseBandwidth: 90, upgradeIncrease: 35 },
    popcorn: { baseBandwidth: 70, upgradeIncrease: 25 }
  },
  
  // Contract settings
  contracts: {
    minBreadRequired: 15,
    maxBreadRequired: 35,
    minCoinsReward: 30,
    maxCoinsReward: 120,
    minPipePartsReward: 1,
    maxPipePartsReward: 3
  },
  
  // Upgrade costs
  upgrades: {
    wheat: { pipeParts: 3, coins: 100, bandwidthIncrease: 40 },
    flour: { pipeParts: 2, coins: 80, bandwidthIncrease: 30 },
    bread: { pipeParts: 1, coins: 60, bandwidthIncrease: 20 },
    corn: { pipeParts: 2, coins: 70, bandwidthIncrease: 35 },
    popcorn: { pipeParts: 1, coins: 50, bandwidthIncrease: 25 }
  },
  
  // Debuff settings
  debuff: {
    triggerThreshold: 1.0, // 100% load
    triggerTime: 20, // Reduced from 30s for faster feedback
    efficiencyPenalty: 0.5, // 50% efficiency when debuffed
    warningThreshold: 0.8 // 80% load warning
  },
  
  // Performance settings
  performance: {
    tickInterval: 1000, // 1 second
    renderInterval: 500, // 0.5 seconds for smoother UI
    maxNotifications: 3,
    notificationDuration: 3000
  },
  
  // Get current crop settings
  getCrop(id) {
    return this.crops[id] || null;
  },
  
  // Get machine settings
  getMachine(id) {
    return this.machines[id] || null;
  },
  
  // Get silo settings
  getSilo(id) {
    return this.silos[id] || null;
  },
  
  // Generate balanced contract
  generateContract() {
    const breadRequired = Math.floor(
      Math.random() * (this.contracts.maxBreadRequired - this.contracts.minBreadRequired + 1) + 
      this.contracts.minBreadRequired
    );
    
    const popcornRequired = Math.floor(
      Math.random() * (this.contracts.maxBreadRequired - this.contracts.minBreadRequired + 1) + 
      this.contracts.minBreadRequired
    );
    
    const coinsReward = Math.floor(
      Math.random() * (this.contracts.maxCoinsReward - this.contracts.minCoinsReward + 1) + 
      this.contracts.minCoinsReward
    );
    
    const pipePartsReward = Math.floor(
      Math.random() * (this.contracts.maxPipePartsReward - this.contracts.minPipePartsReward + 1) + 
      this.contracts.minPipePartsReward
    );
    
    return {
      breadRequired,
      popcornRequired,
      reward: { coins: coinsReward, pipeParts: pipePartsReward },
      completed: false
    };
  },
  
  // Calculate optimal upgrade priority
  getUpgradePriority() {
    const priorities = [];
    
    // Check which silos are most overloaded
    ['wheat', 'flour', 'bread'].forEach(siloId => {
      const silo = SiloManager[siloId];
      const load = silo.meter;
      const canUpgrade = UpgradeManager.canUpgrade(siloId);
      
      priorities.push({
        siloId,
        load,
        canUpgrade,
        priority: load * (canUpgrade ? 1 : 0.5) // Higher priority if can upgrade
      });
    });
    
    return priorities.sort((a, b) => b.priority - a.priority);
  }
}; 