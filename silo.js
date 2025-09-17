window.SiloManager = {
  wheat: { stored: 0, bandwidth: 100, inRate: 0, outRate: 0, meter: 0, debuff: false, debuffTimer: 0 },
  flour: { stored: 0, bandwidth: 80, inRate: 0, outRate: 0, meter: 0, debuff: false, debuffTimer: 0 },
  bread: { stored: 0, bandwidth: 60, inRate: 0, outRate: 0, meter: 0, debuff: false, debuffTimer: 0 },
  corn: { stored: 0, bandwidth: 90, inRate: 0, outRate: 0, meter: 0, debuff: false, debuffTimer: 0 },
  popcorn: { stored: 0, bandwidth: 70, inRate: 0, outRate: 0, meter: 0, debuff: false, debuffTimer: 0 },
  addToSilo(id, amt) {
    if (this[id]) {
      // Apply debuff effect - reduce efficiency when overloaded
      const debuffConfig = GameBalance.debuff;
      const efficiency = this[id].debuff ? debuffConfig.efficiencyPenalty : 1.0;
      const actualAmount = Math.floor(amt * efficiency);
      
      this[id].stored += actualAmount;
      this[id].inRate += amt; // Track original input rate for meter calculation
      
      if (this[id].debuff && amt > 0) {
        console.log(`${id} silo debuffed: ${amt} → ${actualAmount} (${efficiency * 100}% efficiency)`);
      }
    }
  },
  takeFromSilo(id, amt) {
    if (this[id].stored >= amt) {
      this[id].stored -= amt;
      this[id].outRate += amt;
      return true;
    }
    return false;
  },
  tick() {
    // Process all silos
    ['wheat', 'flour', 'bread', 'corn', 'popcorn'].forEach(siloId => {
      const silo = this[siloId];
      let load = ((silo.inRate + silo.outRate) / silo.bandwidth);
      silo.meter = clamp(load, 0, 1.5);
      
      // Enhanced debuff system
      const debuffConfig = GameBalance.debuff;
      if (load >= debuffConfig.triggerThreshold) {
        silo.debuffTimer++;
        if (silo.debuffTimer >= debuffConfig.triggerTime) {
          silo.debuff = true;
          // Apply debuff effects
          this.applyDebuff(siloId);
        }
      } else {
        silo.debuff = false;
        silo.debuffTimer = 0;
      }
      
      // Reset rates after tick
      silo.inRate = 0;
      silo.outRate = 0;
    });
    
    this.render();
  },
  
  // Apply debuff effects
  applyDebuff(siloId) {
    const silo = this[siloId];
    if (silo.debuff) {
      // Reduce production efficiency when debuffed
      // This is handled in addToSilo method instead
      console.log(`${siloId} silo is debuffed - reduced efficiency`);
    }
  },
  render() {
    const p = document.getElementById('silo-panel');
    p.innerHTML = '';
    
    // Render all silos
    ['wheat', 'flour', 'bread', 'corn', 'popcorn'].forEach(siloId => {
      const silo = this[siloId];
      let color = "#44c553";
      if (silo.meter >= 1) color = "#ffc107";
      if (silo.meter >= 1.2) color = "#ef4444";
      
      const siloName = siloId.charAt(0).toUpperCase() + siloId.slice(1);
      p.innerHTML += `
        <div class="silo-item ${silo.debuff ? 'debuffed' : ''}">
          <h4>${siloName} Silo</h4>
          <div>Stored: <b>${silo.stored}</b> / ∞</div>
          <div>Bandwidth: <b>${silo.bandwidth}</b> u/min</div>
          <div class="silo-meter">
            <div class="silo-meter-fill" style="width:${Math.min(silo.meter*100,100)}%;background:${color};"></div>
          </div>
          <div class="debuff-info">
            ${silo.debuff ? `<span class="debuff-warning">⚠️ OVERLOADED! Efficiency: ${GameBalance.debuff.efficiencyPenalty * 100}%</span>` : ""}
            ${silo.meter >= GameBalance.debuff.warningThreshold && !silo.debuff ? `<span class="warning">⚠️ Near capacity!</span>` : ""}
          </div>
        </div>
      `;
    });
    
    // Re-render upgrade buttons after silo content
    if (window.UpgradeManager) {
      UpgradeManager.renderUpgradeButtons();
    }
  }
}
