window.SaveManager = {
  // Save game state
  saveGame() {
    try {
      const gameState = {
        timestamp: Date.now(),
        version: 'P5.0.1',
        
        // Map state
        map: {
          grid: MapManager.grid
        },
        
        // Silo state
        silos: {
          wheat: SiloManager.wheat,
          flour: SiloManager.flour,
          bread: SiloManager.bread,
          corn: SiloManager.corn,
          popcorn: SiloManager.popcorn
        },
        
        // Machine state
        machines: {
          mill: MachineManager.mill,
          bakery: MachineManager.bakery,
          popper: MachineManager.popper
        },
        
        // Contract state
        contract: {
          currentContract: ContractManager.currentContract,
          coins: ContractManager.coins,
          pipeParts: ContractManager.pipeParts
        },
        
        // Social state
        social: {
          boosts: SocialManager.boosts,
          playerStats: SocialManager.playerStats
        }
      };
      
      localStorage.setItem('harvestHearth_save', JSON.stringify(gameState));
      console.log('Game saved successfully!');
      
      // Show save notification
      this.showSaveNotification();
      
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  },
  
  // Load game state
  loadGame() {
    try {
      const saved = localStorage.getItem('harvestHearth_save');
      if (!saved) {
        console.log('No saved game found');
        return false;
      }
      
      const gameState = JSON.parse(saved);
      
      // Validate save version
      if (gameState.version !== 'P5.0.1') {
        console.log('Save version mismatch, starting fresh');
        return false;
      }
      
      // Load map state
      if (gameState.map && gameState.map.grid) {
        MapManager.grid = gameState.map.grid;
      }
      
      // Load silo state
      if (gameState.silos) {
        Object.keys(gameState.silos).forEach(siloId => {
          if (SiloManager[siloId]) {
            SiloManager[siloId] = { ...SiloManager[siloId], ...gameState.silos[siloId] };
          }
        });
      }
      
      // Load machine state
      if (gameState.machines) {
        Object.keys(gameState.machines).forEach(machineId => {
          if (MachineManager[machineId]) {
            MachineManager[machineId] = { ...MachineManager[machineId], ...gameState.machines[machineId] };
          }
        });
      }
      
      // Load contract state
      if (gameState.contract) {
        ContractManager.currentContract = gameState.contract.currentContract || ContractManager.currentContract;
        ContractManager.coins = gameState.contract.coins || 0;
        ContractManager.pipeParts = gameState.contract.pipeParts || 0;
      }
      
      // Load social state
      if (gameState.social) {
        if (gameState.social.boosts) {
          Object.keys(gameState.social.boosts).forEach(boostType => {
            if (SocialManager.boosts[boostType]) {
              SocialManager.boosts[boostType] = { ...SocialManager.boosts[boostType], ...gameState.social.boosts[boostType] };
            }
          });
        }
        if (gameState.social.playerStats) {
          SocialManager.playerStats = { ...SocialManager.playerStats, ...gameState.social.playerStats };
        }
      }
      
      console.log('Game loaded successfully!');
      
      // Show load notification
      this.showLoadNotification();
      
      return true;
    } catch (error) {
      console.error('Failed to load game:', error);
      return false;
    }
  },
  
  // Auto-save every 5 minutes
  startAutoSave() {
    setInterval(() => {
      this.saveGame();
    }, 5 * 60 * 1000); // 5 minutes
  },
  
  // Show save notification
  showSaveNotification() {
    const notification = document.createElement('div');
    notification.className = 'save-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h4>💾 Game Saved!</h4>
        <p>Your progress has been saved</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2000);
  },
  
  // Show load notification
  showLoadNotification() {
    const notification = document.createElement('div');
    notification.className = 'load-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h4>📂 Game Loaded!</h4>
        <p>Welcome back!</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 2000);
  },
  
  // Clear save data
  clearSave() {
    try {
      localStorage.removeItem('harvestHearth_save');
      localStorage.removeItem('harvestHearth_stats');
      console.log('Save data cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear save data:', error);
      return false;
    }
  },
  
  // Check if save exists
  hasSave() {
    return localStorage.getItem('harvestHearth_save') !== null;
  },
  
  // Get save info
  getSaveInfo() {
    try {
      const saved = localStorage.getItem('harvestHearth_save');
      if (saved) {
        const gameState = JSON.parse(saved);
        return {
          timestamp: gameState.timestamp,
          version: gameState.version,
          date: new Date(gameState.timestamp).toLocaleString()
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}; 