import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/search', (req, res) => {
    res.render('search', { playerData: null, matches: [], error: null });
});

app.post('/search', async (req, res) => {
    const { gameName, tagLine } = req.body;
    const apiKey = process.env.RIOT_API_KEY;

    if (!gameName || !tagLine) {
        return res.render('search', { playerData: null, matches: [], error: 'Please enter a valid Riot ID' });
    }

    try {
        const accountResponse = await axios.get(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
            headers: { 'X-Riot-Token': apiKey }
        });

        const { puuid, accountLevel } = accountResponse.data;
        console.log("✅ PUUID obtained:", puuid);
        console.log("✅ Account level:", accountLevel);

        let highestRank = "Unknown";
        try {
            const rankHistoryResponse = await axios.get(`https://la.api.riotgames.com/val/ranked/v1/rank-history/${puuid}`, {
                headers: { 'X-Riot-Token': apiKey }
            });

            if (rankHistoryResponse.data && rankHistoryResponse.data.data) {
                highestRank = rankHistoryResponse.data.data.highestRank;
                console.log("✅ Peak Rating:", highestRank);
            }
        } catch (rankError) {
            console.warn("⚠️ Peak Rating could not be obtained", rankError.response?.data || rankError.message);
        }

        let matches = [];
        try {
            const matchesResponse = await axios.get(`https://la.api.riotgames.com/val/match/v1/matches/by-puuid/${puuid}/recent`, {
                headers: { 'X-Riot-Token': apiKey }
            });

            if (matchesResponse.data && matchesResponse.data.matches) {
                matches = matchesResponse.data.matches.slice(0, 10).map(match => ({
                    matchId: match.matchId,
                    outcome: match.outcome
                }));
                console.log("✅ Match history obtained");
            }
        } catch (matchError) {
            console.warn("⚠️ The match history could not be obtained.", matchError.response?.data || matchError.message);
        }

        res.render('search', {
            playerData: {
                gameName,
                tagLine,
                puuid,
                accountLevel,
                highestRank
            },
            matches,
            error: null
        });

    } catch (error) {
        console.error("❌ Riot API error:", error.response?.data || error.message);
        res.render('search', { playerData: null, matches: [], error: 'The player was not found or there was a problem with the API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
