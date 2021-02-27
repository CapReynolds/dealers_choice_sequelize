const {Sequelize, STRING, TEXT, DATEONLY} = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_db');
const express = require('express');
const app = express();

app.use(express.urlencoded({
    extended: true
  }))

const Game = db.define('games', {
    title: {
        type: STRING(255),
        unique: true,
        allowNull: false
    },
    content: {
        type: TEXT,
        unique: true,
        allowNull: false
    },
    gameArt: {
        type: STRING(255),
        unique: true,
        allowNull: false
    },
    releaseDate: {
        type: DATEONLY,
        allowNull: false
    },
});

const Developer = db.define('developers', {
    name: {
        type: STRING(255),
        unique: true,
        allowNull: false
    },
});

const Publisher = db.define('publishers', {
    name: {
        type: STRING(255),
        unique: true,
        allowNull: false
    },
});

const syncAndSeed = async() => {
    await db.sync({force: true});

    const gameArray = [
        { title: "Jet Grind Radio", 
        content: "Jet Set Radio is a 2000 action game developed by Smilebit and published by Sega for the Dreamcast. The player controls a member of a youth gang, the GGs, as they use inline skates to traverse Tokyo, spraying graffiti and evading authorities. Development was headed by director Masayoshi Kikuchi, with art by Ryuta Ueda.", gameArt: "JetGrindRadio.jpg", 
        releaseDate: new Date(2001,6,11).toDateString(), publisherId: 1, developerId: 1},
        { title: "Soul Calibur",
        content: "Soulcalibur is a weapon-based 3D fighting game developed by Project Soul and produced by Namco. It is the second game in the Soulcalibur series, preceded by Soul Edge in December 1995. Originally released in arcades on July 30, 1998, it ran on the Namco System 12 hardware.", gameArt: "SoulCalibur.jpg", 
        releaseDate: new Date(1998,7,30).toDateString(), publisherId: 2, developerId: 2},
        { title: "Sonic Adventure 2",
        content: "Sonic Adventure 2 is a 2001 platform game developed by Sonic Team USA and published by Sega. It was the final Sonic the Hedgehog game for the Dreamcast after Sega discontinued the console", gameArt: "SonicAdventure.jpg", 
        releaseDate: new Date(2001,6,18).toDateString(), publisherId: 1, developerId: 3},
        { title: "Marvel vs Capcom 2: New Age of Heroes", 
        content: "Marvel vs. Capcom 2: New Age of Heroes is a crossover fighting game developed and published by Capcom. It is the fourth installment in the Marvel vs. Capcom series, which features characters from both Capcom's video game franchises and comic book series published by Marvel Comics", gameArt: "MarvelvsCapcom2.jpg", 
        releaseDate: new Date(2000,2,4).toDateString(), publisherId: 3, developerId: 4},
        { title: "Power Stone 2",  
        content: "Power Stone 2 is a multiplayer fighting game that built on the innovative gameplay introduced by its predecessor, Power Stone. Power Stone 2 allows up to four players to choose from multiple characters and utilize items such as tables, chairs, and rocks in battle.", gameArt: "PowerStone2.jpg", 
        releaseDate: new Date(2000,4,1).toDateString(), publisherId: 3, developerId: 4},
        { title: "Crazy Taxi 2", 
        content: "Crazy Taxi 2 is a 2001 racing video game and the second installment of the Crazy Taxi series. It was released for the Dreamcast and was later ported to the PSP as part of Crazy Taxi: Fare Wars in 2007. It is the last Crazy Taxi game to be released for the Dreamcast after it was discontinued on March 31, 2001.", gameArt: "CrazyTaxi2.jpg", 
        releaseDate: new Date(2001,5,28).toDateString(), publisherId: 1, developerId: 3},
        { title: "Sonic Adventure", 
        content: "Sonic Adventure is a 1998 platform game for Sega's Dreamcast and the first main Sonic the Hedgehog game to feature 3D gameplay.", gameArt: "SonicAdventure.jpg", 
        releaseDate: new Date(1998,12,23).toDateString(), publisherId: 1, developerId: 1},
        { title: "San Fransico Rush 2049", 
        content: "San Francisco Rush 2049 is a racing video game developed and published by Atari Games for arcades. It was ported to the Nintendo 64, Game Boy Color, and Dreamcast by Midway Games. It was released on September 7, 2000 in North America and November 17, 2000 in Europe.", gameArt: "Rush2049.jpg", 
        releaseDate: new Date(1999,10,1).toDateString(), publisherId: 4, developerId: 6},
        { title: "Ready 2 Rumble", 
        content: "Ready 2 Rumble Boxing is a boxing video game developed by Midway Studios San Diego, published by Midway Games in 1999 for the Dreamcast, PlayStation, Game Boy Color, and Nintendo 64. The success of the Dreamcast version led to it becoming one of the few Sega All Stars titles.", gameArt: "Ready2Rumble.jpg", 
        releaseDate: new Date(1999,9,8).toDateString(), publisherId: 4, developerId: 7},
        { title: "Tony Hawk Pro Skater 2",
        content: "Tony Hawk's Pro Skater 2 is a skateboarding video game developed by Neversoft and published by Activision. It is the second installment in the Tony Hawk's series of sports games and was released for the PlayStation in 2000, with subsequent ports to Microsoft Windows, Game Boy Color, and Dreamcast the same year.", gameArt: "TonyHawk.jpg", 
        releaseDate: new Date(2000,11,19).toDateString(), publisherId: 5, developerId: 8}
    ];

    const devArray = [
        {name: "Smilebit, BitWorks"},
        {name: "Project Soul, Namco"},
        {name: "Sega, Sonic Team"},  
        {name: "Capcom"},
        {name: "Sega Hitmaker"},
        {name: "Atari Games, BitWorks"},
        {name: "Point of View, Midway Games, Crawfish Interactive"},
        {name: "Neversoft, Activision"}
    ];

    const pubArray = [
        {name: "Sega"},
        {name: "Namco, BANDAI Entertainment"},
        {name: "Capcom"},
        {name: "Midway Games"},
        {name: "Activision"}
    ];

    //gameArray = await Promise.all(gameArray.map(game =>Game.create(game)));

    const games = await Promise.all(
        gameArray.forEach(game => {[
            Game.create(game),
        ]})
    );

    const devs = await Promise.all(
        devArray.forEach(developer => {[
            Developer.create(developer),
        ]})
    );

    const pubs = await Promise.all(
        pubArray.forEach(publisher => {[
            Publisher.create(publisher),
        ]})
    );
    //devArray = await Promise.all(devArray.map(developer =>Developer.create(developer)));

    //pubArray = await Promise.all(pubArray.map(publisher =>Publisher.create(publisher)));
} 

Game.belongsTo(Developer);
Game.belongsTo(Publisher);

const init = async() => {
    try {
        await db.authenticate();
        //console.log('connected to db')
        await syncAndSeed();

        const port = process.env.PORT || 3000;

        app.listen(port, ()=>console.log(`listening on port ${port}`));
    }
    catch(ex) {
        console.log(ex);
    }
};

init();
