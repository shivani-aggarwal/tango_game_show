# Tango Game Show Network

This project runs a game show simulation using various parameters. The idea is for the user to be able to customize the game show parameters (such as number of briefcases, number of prizes, etc.) and view the results of the simulation (number of prizes won). Currently the parameters are not editable in the UI (future tasks involve making the fields editable and verifying user input). 

## Game Turn Format

There are 3 briefcases, with only 1 of them containing the prize. The turns are as follows:

### Turn 1
Contestant chooses 1 briefcase

### Turn 2
Host eliminates 1 briefcase (host is aware of prize location)

### Turn 3
Contestant is asked if they would like to switch their briefcase or keep it (contestant's choice is randomized)

### Turn 4
Host reveals the contents of the chosen briefcase

## Instructions to Run

Use the following instructions to run the project:

### Open terminal on your computer

### Clone the repository using the command `git clone https://github.com/shivani-aggarwal/tango_game_show.git`

### Run the command `npm install`

### Run the command `npm start`
It might take a bit of time for the project to start

### The project should be available in your browser at: [http://localhost:3000](http://localhost:3000)

### Click on the "Run Simulation" button
The results may take a bit of time to appear

### View the results!