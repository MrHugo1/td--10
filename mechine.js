window.MachineManager = {
  mill: { busy: false, timer: 0, progress: 0 },
  bakery: { busy: false, timer: 0, progress: 0 },
  popper: { busy: false, timer: 0, progress: 0 },
  flour: 0,
  tick() {
    // Mill processing
    const mill = this.mill;
    const millConfig = GameBalance.getMachine('mill');
    if (!mill.busy && window.SiloManager.takeFromSilo("wheat", millConfig.inputAmount)) {
      mill.busy = true;
      mill.timer = now();
      mill.progress = 0;
    }
    if (mill.busy) {
      mill.progress = now() - mill.timer;
      if (mill.progress >= millConfig.procTime) {
        window.SiloManager.addToSilo("flour", millConfig.outputAmount);
        mill.busy = false;
      }
    }
    
    // Bakery processing
    const bakery = this.bakery;
    const bakeryConfig = GameBalance.getMachine('bakery');
    if (!bakery.busy && window.SiloManager.takeFromSilo("flour", bakeryConfig.inputAmount)) {
      bakery.busy = true;
      bakery.timer = now();
      bakery.progress = 0;
    }
    if (bakery.busy) {
      bakery.progress = now() - bakery.timer;
      if (bakery.progress >= bakeryConfig.procTime) {
        window.SiloManager.addToSilo("bread", bakeryConfig.outputAmount);
        bakery.busy = false;
      }
    }
    
    // Popper processing
    const popper = this.popper;
    const popperConfig = GameBalance.getMachine('popper');
    if (!popper.busy && window.SiloManager.takeFromSilo("corn", popperConfig.inputAmount)) {
      popper.busy = true;
      popper.timer = now();
      popper.progress = 0;
    }
    if (popper.busy) {
      popper.progress = now() - popper.timer;
      if (popper.progress >= popperConfig.procTime) {
        window.SiloManager.addToSilo("popcorn", popperConfig.outputAmount);
        popper.busy = false;
      }
    }
    
    this.render();
  },
  render() {
    const p = document.getElementById('mill-panel');
    const millConfig = GameBalance.getMachine('mill');
    const bakeryConfig = GameBalance.getMachine('bakery');
    const popperConfig = GameBalance.getMachine('popper');
    
    p.innerHTML = `
      <div class="machine-item">
        <h3>Mill</h3>
        <div>Status: ${this.mill.busy ? "Processing..." : "Idle"}</div>
        <div>Recipe: ${millConfig.inputAmount} Wheat → ${millConfig.outputAmount} Flour</div>
        ${this.mill.busy ? `<div>⏳ ${millConfig.procTime - this.mill.progress}s</div>` : ""}
      </div>
      <div class="machine-item">
        <h3>Bakery</h3>
        <div>Status: ${this.bakery.busy ? "Processing..." : "Idle"}</div>
        <div>Recipe: ${bakeryConfig.inputAmount} Flour → ${bakeryConfig.outputAmount} Bread</div>
        ${this.bakery.busy ? `<div>⏳ ${bakeryConfig.procTime - this.bakery.progress}s</div>` : ""}
      </div>
      <div class="machine-item">
        <h3>Popper</h3>
        <div>Status: ${this.popper.busy ? "Processing..." : "Idle"}</div>
        <div>Recipe: ${popperConfig.inputAmount} Corn → ${popperConfig.outputAmount} Popcorn</div>
        ${this.popper.busy ? `<div>⏳ ${popperConfig.procTime - this.popper.progress}s</div>` : ""}
      </div>
    `;
  }
}
