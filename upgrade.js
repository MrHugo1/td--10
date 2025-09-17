window.UpgradeManager = {
  get upgradeCosts() {
    return GameBalance.upgrades;
  },
  
  // Kiểm tra có thể nâng cấp không
  canUpgrade(siloId) {
    const cost = this.upgradeCosts[siloId];
    return ContractManager.pipeParts >= cost.pipeParts && 
           ContractManager.coins >= cost.coins;
  },
  
  // Thực hiện nâng cấp
  upgrade(siloId) {
    if (this.canUpgrade(siloId)) {
      const cost = this.upgradeCosts[siloId];
      
      // Trừ chi phí
      ContractManager.pipeParts -= cost.pipeParts;
      ContractManager.coins -= cost.coins;
      
      // Tăng bandwidth
      SiloManager[siloId].bandwidth += cost.bandwidthIncrease;
      
      // Reset debuff nếu có
      SiloManager[siloId].debuff = false;
      SiloManager[siloId].debuffTimer = 0;
      
      console.log(`Upgraded ${siloId} silo! New bandwidth: ${SiloManager[siloId].bandwidth}`);
      
      // Hiển thị thông báo
      this.showUpgradeNotification(siloId, cost.bandwidthIncrease);
      
      return true;
    }
    return false;
  },
  
  // Hiển thị thông báo nâng cấp
  showUpgradeNotification(siloId, increase) {
    const notification = document.createElement('div');
    notification.className = 'upgrade-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h4>🎉 Upgrade Successful!</h4>
        <p>${siloId.charAt(0).toUpperCase() + siloId.slice(1)} Silo</p>
        <p>+${increase} Bandwidth</p>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  },
  
  // Hiển thị popup nâng cấp
  showUpgradePopup(siloId) {
    const cost = this.upgradeCosts[siloId];
    const canUpgrade = this.canUpgrade(siloId);
    const currentBandwidth = SiloManager[siloId].bandwidth;
    const newBandwidth = currentBandwidth + cost.bandwidthIncrease;
    
    const popup = document.createElement('div');
    popup.className = 'upgrade-popup-overlay';
    popup.innerHTML = `
      <div class="upgrade-popup">
        <div class="popup-header">
          <h3>Upgrade ${siloId.charAt(0).toUpperCase() + siloId.slice(1)} Silo</h3>
          <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="popup-content">
          <div class="current-stats">
            <p>Current Bandwidth: <b>${currentBandwidth}</b> u/min</p>
            <p>New Bandwidth: <b>${newBandwidth}</b> u/min</p>
          </div>
          <div class="upgrade-cost">
            <p>Cost:</p>
            <p>🔧 ${cost.pipeParts} Pipe Parts</p>
            <p>💰 ${cost.coins} Coins</p>
          </div>
          <div class="resource-check">
            <p>Available:</p>
            <p class="${ContractManager.pipeParts >= cost.pipeParts ? 'sufficient' : 'insufficient'}">
              🔧 ${ContractManager.pipeParts}/${cost.pipeParts} Pipe Parts
            </p>
            <p class="${ContractManager.coins >= cost.coins ? 'sufficient' : 'insufficient'}">
              💰 ${ContractManager.coins}/${cost.coins} Coins
            </p>
          </div>
        </div>
        <div class="popup-actions">
          <button class="upgrade-btn ${canUpgrade ? 'ready' : 'disabled'}" 
                  ${canUpgrade ? `onclick="UpgradeManager.upgrade('${siloId}'); this.parentElement.parentElement.parentElement.remove()"` : 'disabled'}>
            ${canUpgrade ? 'Upgrade Now' : 'Insufficient Resources'}
          </button>
          <button class="cancel-btn" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(popup);
  },
  
  // Render upgrade buttons trong silo panel
  renderUpgradeButtons() {
    const siloPanel = document.getElementById('silo-panel');
    const upgradeSection = document.createElement('div');
    upgradeSection.className = 'upgrade-section';
    upgradeSection.innerHTML = '<h4>Upgrades</h4>';
    
    ['wheat', 'flour', 'bread', 'corn', 'popcorn'].forEach(siloId => {
      const cost = this.upgradeCosts[siloId];
      const canUpgrade = this.canUpgrade(siloId);
      
      upgradeSection.innerHTML += `
        <button class="upgrade-silo-btn ${canUpgrade ? 'ready' : 'disabled'}" 
                ${canUpgrade ? `onclick="UpgradeManager.showUpgradePopup('${siloId}')"` : 'disabled'}>
          Upgrade ${siloId.charAt(0).toUpperCase() + siloId.slice(1)} Silo
          <small>(${cost.pipeParts}🔧 ${cost.coins}💰)</small>
        </button>
      `;
    });
    
    // Thêm vào cuối silo panel
    siloPanel.appendChild(upgradeSection);
  }
}; 