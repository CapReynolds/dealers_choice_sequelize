const {syncAndSeed, findAllGames, findGame, models:{Developer, Publisher, Game}, db} = require('./db');
const express = require('express');
const app = express();
const path = require('path');
app.use(require('morgan')('dev'));

app.use(express.urlencoded({
    extended: true
  }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));


const init = async() => {
    try {
        await db.authenticate();
        console.log('connected to db')
        await syncAndSeed();

        const port = process.env.PORT || 3000;

        app.listen(port, ()=>console.log(`listening on port ${port}`));
    }
    catch(ex) {
        console.log(ex);
    }
};

init();

app.get('/', async(req, res, next)=>{
    res.redirect('/gamesList');
});

app.get('/gamesList', async (req, res, next) => {
    try {
        var gamesList = await findAllGames(); 
        var game;
        var gameArray = [];
        let newgame;
        for(let i = 10; i>0; i--)
        {
            game = await findGame(i);
            gameArray.push(game);
        }
        res.send( `
        <html>
            ${head()}
            <body>
                <h1>Top 10 Sega Dreamcast Games</h1>
                ${nav(req.url)}
                <div id = "games-list">
                    ${displayData(gameArray)}
                </div>
            </body>
        </html>
        `);;
    }
    catch(ex)
    {
        next(ex);
    }
  });

  app.get('/games/:id', async (req, res, next) => {
    var game = await findGame(req.params.id);
    res.send( `
    <html>
        ${head()}
        <body>
            <h1>Top 10 Sega Dreamcast Games</h1>
            ${nav(req.url)}
            <div id = "games-list">
            ${displayGame(game)}    
            </div>
            <div class="controls">
            ${displayControls(req.params.id)}
            </div>
        </body>
    </html>
    `);
   
});

const nav =(url)=> {
    return `
    <nav>
        <a href='/' class='${url === '/' ? 'selected' : ''}'>Home</a>
    
    </nav>
    `;
}

const head =()=> {
    return `
    <head>
        <title>Top 10 Sega Dreamcast Games</title>
        <link rel="stylesheet" href="/assets/style.css" />
    </head>
    `;
}


const displayData = (gameArray) => {
    var gameList = '';
    var gameObj;
    gameArray.map(game => {
        gameObj = game[0];
        gameList += 
            `<div id= "game-item"> 
                <div id="rank"><rankID>${gameObj.id}</rankID></div>           
                <div class="game-info">
                    <div id= "title"><a href = '/games/${gameObj.id}'>${gameObj.title}</a></div>
                    <div id= "details"><small><red>Publisher: </red>${gameObj.publisher.name} | <red>Developer: </red>${gameObj.developer.name} | <red>Released: </red>${gameObj.releaseDate}</small></div>
                </div>
            </div>
            `;
    });
    return gameList;
} 


const displayGame = (game) =>{
    var gameList = ''; 
    var gameObj;
    gameObj = game[0];
    gameList += 
    `<div id= "game-itemB"> 
        <img src="/assets/${gameObj.gameArt}"/>   
        <div class="game-item2">
            <div id="rank">${gameObj.id}</div>   
            <div id="content"><p>${gameObj.content}</p></div>
            <div id= "details2"><small><red>Publisher: </red>${gameObj.publisher.name} | <red>Developer: </red>${gameObj.developer.name.join} | <red>Released: </red>${gameObj.releaseDate}</small></div>
        </div>  
    </div>
`;
    return gameList;
}

const displayControls = (id) => {
    var gameList;
    var previous = parseInt(id) + 1;
    var next = parseInt(id) - 1;
    if(next === 0)
    {
        gameList = `
        <div id = "box">
            <div id = "arrow"><a href = '/games/${previous}'> < </a></div>
            <div><img src="/assets/segaSwirl3.jpeg"width="30" height="30"></div>
        </div>
    `
    }
    else if(previous === 11)
    {
        gameList = `
        <div id = "box">
            <div><img src="/assets/segaSwirl3.jpeg"width="30" height="30"></div>
            <div id = "arrow"><a href = '/games/${next}'> > </a></div>
        </div>
    `
    }
    else{
        gameList = `
        <div id = "box">
            <div id = "arrow"><a href = '/games/${previous}'> < </a></div>
            <div><img src="/assets/segaSwirl3.jpeg"width="30" height="30"></div>
            <div id = "arrow"><a href = '/games/${next}'> > </a></div>
        </div>
    `
    }
    return gameList;
}


