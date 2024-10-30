const carCanvas=document.getElementById("carCanvas");
carCanvas.width=Math.min(200, window.innerWidth * 0.9);
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
  //getting nmutation fromthe fronend
    var mutation = document.getElementById("mutation").value;  
const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

let cars = [];
let bestCar;
let traffic = [];

function startGame() {
    // Get values from controls
    const controlType = document.getElementById("controlType").value;
    const carCount = parseInt(document.getElementById("carCount").value);
    
    // Reset game state
    cars = generateCars(carCount, controlType);
    bestCar = cars[0];
    
    // Reset traffic
    traffic = [
        new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
        new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
    ];

    // Load best brain if available
    if(localStorage.getItem("bestBrain")){
        for(let i=0;i<cars.length;i++){
            cars[i].brain=JSON.parse(
                localStorage.getItem("bestBrain"));
            if(i!=0){
                const mutationAmount = parseFloat(document.getElementById("mutation").value);
                NeuralNetwork.mutate(cars[i].brain, mutationAmount);
            }
        }
    }
}

function generateCars(N, controlType){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,controlType));
    }
    return cars;
}

// Initialize game with default values
startGame();

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    const heightRatio = window.innerWidth <= 768 ? 0.7 : 1;
    carCanvas.height=window.innerHeight*heightRatio;
    if (window.innerWidth > 768) {
        networkCanvas.height=window.innerHeight;
    }

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    // Only draw network visualization if not on mobile
    if (window.innerWidth > 768) {
        networkCtx.lineDashOffset=-time/50;
        Visualizer.drawNetwork(networkCtx,bestCar.brain);
    }
    
    requestAnimationFrame(animate);
}

// Add at the start of main.js
window.addEventListener('error', function(e) {
    console.error('Runtime error:', e);
    // Display user-friendly error message
    showError('Something went wrong. Please refresh the page.');
});

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
}

// Add loading indicator
function showLoading(show) {
    const loader = document.getElementById('loader');
    if (show) {
        loader.style.display = 'block';
    } else {
        loader.style.display = 'none';
    }
}

function saveState() {
    const gameState = {
        cars: cars.map(car => ({
            brain: car.brain,
            position: { x: car.x, y: car.y },
            speed: car.speed
        })),
        traffic: traffic.map(car => ({
            position: { x: car.x, y: car.y }
        })),
        settings: {
            mutation: document.getElementById('mutation').value,
            carCount: document.getElementById('carCount').value,
            controlType: document.getElementById('controlType').value
        }
    };
    
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadState() {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            // Restore game state
            return state;
        } catch (e) {
            console.error('Failed to load saved state:', e);
            return null;
        }
    }
    return null;
}

// Add resize handler
window.addEventListener('resize', function() {
    carCanvas.width = Math.min(200, window.innerWidth * 0.9);
});