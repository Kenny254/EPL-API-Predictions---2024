// Define constants
const API_HOST = 'v3.football.api-sports.io';
const API_KEY = '63d3769e20d968bfb9e3e3752e969967';
const EPL_LEAGUE_ID = 39;
const YEAR = 2024;

// Function to fetch upcoming fixtures
async function fetchFixtures() {
    try {
        const response = await fetch(`https://${API_HOST}/fixtures?league=${EPL_LEAGUE_ID}&season=${YEAR}&status=NS`, {
            headers: {
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': API_KEY
            }
        });
        const data = await response.json();
        return data.response || [];
    } catch (error) {
        console.error('Error fetching fixtures:', error);
        return [];
    }
}

// Function to fetch predictions for a fixture
async function fetchPrediction(fixtureId) {
    try {
        const response = await fetch(`https://${API_HOST}/predictions?fixture=${fixtureId}`, {
            headers: {
                'x-rapidapi-host': API_HOST,
                'x-rapidapi-key': API_KEY
            }
        });
        const data = await response.json();
        return data.response ? data.response[0].predictions : null;
    } catch (error) {
        console.error('Error fetching prediction:', error);
        return null;
    }
}

// Function to render fixtures in the table
async function renderFixtures() {
    const fixtures = await fetchFixtures();
    const tableBody = document.querySelector('#fixtures-table tbody');

    for (const fixture of fixtures) {
        const fixtureDetails = fixture.fixture;
        const teams = fixture.teams;
        const homeTeam = teams.home.name;
        const awayTeam = teams.away.name;
        const dateStr = fixtureDetails.date;
        const date = new Date(dateStr).toLocaleString(); // Convert ISO string to readable date

        // Fetch prediction
        const prediction = await fetchPrediction(fixtureDetails.id);
        const winner = prediction ? prediction.winner.name || 'Draw' : null;

        // Only create a row if there is data available
        if (winner !== null) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${homeTeam}</td>
                <td>${awayTeam}</td>
                <td>${winner}</td>
            `;
            tableBody.appendChild(row);
        }
    }
}

// Load fixtures on page load
document.addEventListener('DOMContentLoaded', renderFixtures);
