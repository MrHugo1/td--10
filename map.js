// Simple map manager
const GRID_SIZE = 3;

window.MapManager = {
  grid: Array(GRID_SIZE * GRID_SIZE).fill().map(()=>({ cropId: null, plantedAt: 0, status: "empty" })),
  currentCropSelection: 'wheat', // Track which crop to plant next
  render() {
    const root = document.getElementById('field-grid');
    root.innerHTML = "";
    
    // Add crop selection button
    const cropSelector = document.createElement('div');
    cropSelector.className = 'crop-selector';
    const currentCrop = CropManager.getCrop(this.currentCropSelection);
    cropSelector.innerHTML = `
      <div class="crop-selector-btn" onclick="MapManager.switchCrop()">
        <span>Planting: ${currentCrop ? currentCrop.emoji : '🌾'} ${this.currentCropSelection}</span>
        <small>Click to switch</small>
      </div>
    `;
    root.appendChild(cropSelector);
    
    // Add field tiles container
    const tilesContainer = document.createElement('div');
    tilesContainer.className = 'field-tiles-container';
    
    this.grid.forEach((plot, idx) => {
      const div = document.createElement('div');
      div.className = 'field-tile ' + (plot.status !== 'empty' ? plot.status : '');
      if (plot.status === "growing" && plot.cropId) {
        const crop = CropManager.getCrop(plot.cropId);
        div.innerText = crop ? crop.emoji + "⏳" : "⏳";
      } else if (plot.status === "ready" && plot.cropId) {
        const crop = CropManager.getCrop(plot.cropId);
        div.innerText = crop ? crop.emoji : "🌾";
      }
      else div.innerText = "🟫";
      div.onclick = () => this.handleClick(idx);
      tilesContainer.appendChild(div);
    });
    
    root.appendChild(tilesContainer);
  },
  handleClick(idx) {
    const plot = this.grid[idx];
    if (plot.status === "empty") {
      // Plant the currently selected crop
      plot.cropId = this.currentCropSelection;
      plot.plantedAt = now();
      plot.status = "growing";
      console.log(`Planted ${this.currentCropSelection} at plot ${idx}`);
    } else if (plot.status === "ready") {
      // Harvest
      const crop = CropManager.getCrop(plot.cropId);
      if (crop) {
        const yieldAmount = crop.yield;
        // For corn, we add to corn silo, not popcorn silo
        const siloId = plot.cropId === 'corn' ? 'corn' : (crop.output || plot.cropId);
        window.SiloManager.addToSilo(siloId, yieldAmount);
        this.grid[idx] = { cropId: null, plantedAt: 0, status: "empty" };
        console.log(`Harvested ${yieldAmount} ${siloId} from plot ${idx}!`);
      }
    }
    this.render();
  },
  tick() {
    this.grid.forEach((plot, idx) => {
      if (plot.status === "growing" && plot.cropId) {
        const crop = CropManager.getCrop(plot.cropId);
        if (crop && now() - plot.plantedAt >= crop.growTime) {
          plot.status = "ready";
        }
      }
    });
    this.render();
  },
  
  // Switch between available crops
  switchCrop() {
    const availableCrops = CropManager.getAvailableCrops();
    const currentIndex = availableCrops.indexOf(this.currentCropSelection);
    const nextIndex = (currentIndex + 1) % availableCrops.length;
    this.currentCropSelection = availableCrops[nextIndex];
    console.log(`Switched to planting: ${this.currentCropSelection}`);
    this.render();
  }
}
