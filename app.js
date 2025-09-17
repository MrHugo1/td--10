window.onload = function() {
  // Initialize social and save systems
  SocialManager.init();
  SaveManager.startAutoSave();
  
  // Try to load saved game
  if (SaveManager.hasSave()) {
    SaveManager.loadGame();
  }
  
  // Initialize game systems
  MapManager.render();
  SiloManager.render(); // This will also render upgrade buttons
  MachineManager.render();
  ContractManager.tick();
  SocialManager.render();

  // Main game loop with optimized intervals
  const tickInterval = GameBalance.performance.tickInterval;
  const renderInterval = GameBalance.performance.renderInterval;
  
  // Game logic tick (1 second)
  setInterval(() => {
    MapManager.tick();
    SiloManager.tick(); // This will also re-render upgrade buttons
    MachineManager.tick();
    ContractManager.tick();
    SocialManager.updateBoosts();
  }, tickInterval);
  
  // UI render tick (0.5 seconds for smoother updates)
  setInterval(() => {
    SocialManager.render();
  }, renderInterval);
};

function renderHUD() {
  const readyPlots = MapManager.grid.filter(p => p.status === "ready").length;
  const debuffedSilos = ['wheat', 'flour', 'bread', 'corn', 'popcorn'].filter(id => SiloManager[id].debuff).length;
  const upgradePriorities = GameBalance.getUpgradePriority();
  const activeBoosts = Object.keys(SocialManager.boosts).filter(type => SocialManager.boosts[type].active);
  
  document.getElementById('debug-hud').innerHTML =
    `<b>Debug HUD</b><br>
    Wheat: ${SiloManager.wheat.stored} (${Math.round(SiloManager.wheat.meter*100)}%) ${SiloManager.wheat.debuff ? '⚠️' : ''}<br>
    Flour: ${SiloManager.flour.stored} (${Math.round(SiloManager.flour.meter*100)}%) ${SiloManager.flour.debuff ? '⚠️' : ''}<br>
    Bread: ${SiloManager.bread.stored} (${Math.round(SiloManager.bread.meter*100)}%) ${SiloManager.bread.debuff ? '⚠️' : ''}<br>
    Corn: ${SiloManager.corn.stored} (${Math.round(SiloManager.corn.meter*100)}%) ${SiloManager.corn.debuff ? '⚠️' : ''}<br>
    Popcorn: ${SiloManager.popcorn.stored} (${Math.round(SiloManager.popcorn.meter*100)}%) ${SiloManager.popcorn.debuff ? '⚠️' : ''}<br>
    Mill: ${MachineManager.mill.busy ? "Running" : "Idle"}<br>
    Bakery: ${MachineManager.bakery.busy ? "Running" : "Idle"}<br>
    Popper: ${MachineManager.popper.busy ? "Running" : "Idle"}<br>
    Coins: ${ContractManager.coins} | Pipe Parts: ${ContractManager.pipeParts}<br>
    Ready Plots: ${readyPlots}<br>
    Debuffed Silos: ${debuffedSilos}<br>
    Active Boosts: ${activeBoosts.length}<br>
    ${upgradePriorities.length > 0 ? `Priority: ${upgradePriorities[0].siloId} (${Math.round(upgradePriorities[0].load*100)}%)` : ''}`;
}
