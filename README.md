# Valorant-Profile-Explorer

This is a simple web application that allows users to search for Valorant player information using the Riot Games API.

Features

    1. Search for a Valorant player using Riot ID (Game Name and Tag Line)
    2. Display player's account level and highest rank achieved
    3. Show recent match history

NOTE: Keep in mind that in order to make use of these functions, you must request your API Key on the Riot developer 
page (https://developer.riotgames.com) and depending on the permits that this key has, the functions of the web application 
are limited.

Prerequisites

Make sure you have the following installed:

        - Node.js (version 16 or later recommended)
        - Git

Installation

1. Clone the repository:

        git clone https://github.com/DAlejandroCl/Valorant-Profile-Explorer

2. Navigate to the project directory:

        cd your-repository

3. Install dependencies:

        npm install

4. Create a file called ".env" in the root directory and add your Riot API key:

        RIOT_API_KEY=your_api_key_here

Running the Application

1. Start the server with:

        node index.js or nodemon index.js

Usage

    1. Open http://localhost:3000/ in your web browser.
    2. Enter the Riot ID (Game Name and Tag Line) and search for player information.
    3. View player details including account level, rank, and match history.
