//https://www.solarsystemscope.com/spacepedia/handbook/
//https://www.solarsystemscope.com/textures/
//https://www.youtube.com/watch?v=Hxn9OBH4hWY
//https://en.wikipedia.org/wiki/Stellar_evolution
//https://en.wikipedia.org/wiki/Stellar_classification
const planetsData = [ //Name, Body Type, Scale, Distance Divider, Texture, Info Text
    [
        "Earth",
        "planet",
        0.1,
        10,
        "./images/2k_earth_daymap.jpg",
        "Earth\n\nOur homeworld is the densest of the eight planets in the Solar System. It is also the largest of the four terrestrial planets.\n\nSurface\nAbout 71% of the Earth\'s surface is covered by salt water oceans, and the remaining 30% is taken up by the seven continental landmasses. Earth\'s outer surface is also divided into several rigid segments, or tectonic plates, that migrate across the surface over periods of millions of years.\n\nAxial tilt\nToday, the Earth is tilted on its axis by 23.4°, producing seasonal variations in climate and weather across the surface of the planet during the course of a year.\n\nMagnetic field\nThe Earth\'s magnetic field is generated within the molten outer core region of the planet and extends outwards to form the magnetosphere: a barrier surrounding the Earth, deflecting particles of the solar wind and protecting the Earth from Sun's radiation."
    ],
    [
        "Moon",
        "planet",
        0.025,
        1,
        "./images/2k_moon.jpg",
        "Moon\n\nThe Moon is Earth\'s only natural satellite. Next to the Sun, the Moon exerts the greatest influence on the Earth itself, most notably through its affect on Earth\'s tides.\n\nMass\nThe Moon is the largest natural satellite relative to the size of its primary - having 27% percent the diameter and 60% the density of the Earth. The Moon is larger than Pluto.\n\nOrigin\nThe current prevailing hypothesis for the origin of the Moon is that it formed as a result of Mars-sized body colliding with the newly-formed proto-Earth. The material ejected from this impact accreted to form the Moon 4.53 billion years ago.\n\nObservation\nThe Moon is the brightest object in the sky after the Sun, although its surface is actually dark, reflecting only 7 percent of the light falling on it. Moon\'s current orbital distance causes it to appear almost the same size in the sky as the Sun."
    ],
    [
        "Mars",
        "planet",
        0.05,
        5,
        "./images/2k_mars.jpg",
        "Mars\n\nMars is the fourth planet from the Sun and the second smallest planet in the Solar System. The reddish appearance of Mars\' surface is caused by iron oxide (rust).\n\nEarth-like\nWhile the Mars is about half as big as the Earth, there are still many similarities: Mars has a rocky surface and polar ice caps, the days on Mars are only 40 minutes longer, the axial tilt gives it similar seasons to ours (although each lasts about twice as long)\n\nSurface\nMars has a dramatic landscape, with towering volcanoes and a great canyon system. Of all the planets in the Solar System, it has the highest mountain, Olympus Mons, and the largest canyon, Valles Marineris.\n\nWater\nThere is strong evidence that the Martian atmosphere was once far denser than it is now, and that water once ran freely on its surface. There is also mounting evidence that much of this water remains locked away underground.\n\nMoons\nMars has two small natural satellites, Phobos and Deimos, that orbit very close to the planet. These moons may be captured asteroids. It has been predicted that in about 50 million years, Phobos will either crash into Mars\' surface or break up into a ring structure around the planet.\n\nMissions\nMars is the focus of intense study, with two rovers (exploration rover Opportunity and science laboratory Curiosity) operating on the surface, while three international missions orbit the planet: NASA\'s Mars Odyssey and Mars Reconnaissance Orbiter and ESA\'s Mars Express.\n\nObservation\nMars can easily be seen from Earth with the naked eye, as can its reddish coloring. Its apparent magnitude is surpassed by the Sun, the Moon, Venus and Jupiter - but it can briefly match Jupiter\'s brightness at certain points in its orbit."
    ],
    [
        "Jupiter",
        "planet",
        1.1,
        10,
        "./images/2k_jupiter.jpg",
        "Jupiter\n\nJupiter is the largest planet of the Solar System, with a mass 2.5 greater than all of the rest of the planets combined - but still only one-thousandth that of the Sun.\n\nStar-like\nJupiter is the planet most like the Sun in terms of its composition. Although Jupiter would still need to be about 75 times as massive to fuse hydrogen and become a star, it would only need to be 13 times as massive to burn deuterium and become a brown dwarf.\n\nAtmosphere\nJupiter spins on its axis faster than any other planet. Because of this rotation, Jupiter\'s atmosphere is subject to high winds, which cause the atmosphere to form distinct bands of colour, like swirling vortices and gigantic anticyclonic storms.\n\nMoons\nJupiter governs the largest number of moons of any planet, with the current official total being 67. The four largest are the Galilean moons: Io, Europa, Ganymede, and Callisto. Ganymede, the largest moon in the Solar System, has a diameter greater than that of the planet Mercury.\n\nObservation\nJupiter is the fourth brightest object in our skies after the Sun, Moon and Venus. Because the orbit of Jupiter is outside the Earth\'s, the planet always appears nearly fully illuminated when viewed through Earth-based telescopes."
    ],
    [
        "Sun",
        "star",
        10.9,
        10,
        "./images/2k_star_G.jpg",
        "Sun\n\nThe Sun, also referred to as \"Sol\", is the star at the center of the Solar System. Sun\'s mass accounts for some 99.86% of the total mass of the Solar System.\n\nComposition\nRoughly three-quarters of the Sun\'s mass is hydrogen, with the rest mostly helium. Only 1.69% of the Sun (which is still 5,628 times the mass of the Earth) is made up of heavier elements like carbon, iron, neon and oxygen.\n\nDistance\nThe mean distance of the Sun from the Earth is approximately 149.6 million kilometres (1 AU). On average, it takes light from the Sun about 8 minutes and 19 seconds to reach the Earth.\n\nGalaxy\nOnce thought to be a relatively insignificant star, the Sun is now considered to be brighter than about 85% of the stars in the Milky Way galaxy. It is located about two thirds of the way out from the centre of the Milky Way."
    ],
    [
        "Sirius A",
        "star",
        21.8,
        20,
        "./images/2k_star_A.jpg",
        "Sirius A\n\nLorum Ipsum"
    ],
    [
        "Pollux",
        "star",
        98.1,
        30,
        "./images/2k_star_K.jpg",
        "Pollux\n\nLorum Ipsum"
    ],
    [
        "Betelgeuse",
        "star",
        13080.0,
        20,
        "./images/2k_star_M.jpg",
        "Betelgeuse\n\nLorum Ipsum"
    ]
];