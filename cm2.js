let blocks = [];
let connections = [];

let xOffset = 0;
let yOffset = 0;
let zOffset = 0;

let offset = [];

function clear() {
    blocks = [];
    connections = []

    offset = [];

    xOffset = 0;
    yOffset = 0;
    zOffset = 0;
}

function offsetCall(x, y, z) {
    offset.push({
        x: xOffset,
        y: yOffset,
        z: zOffset
    });

    xOffset += x;
    yOffset += y;
    zOffset += z;
}

function offsetReturn() {
    let pos = offset.pop();

    xOffset = pos.x;
    yOffset = pos.y;
    zOffset = pos.z;
}

function round(num) {
    return Math.round((num + Number.EPSILON) * 1e12) / 1e12;
}

function format(template, input=[]) {

    if (!Array.isArray(input))
        input = [input];

    while (input.length > template.length)
        input.pop();

    for (let i = 0; i < input.length; i++) {
        if (input[i] == template[i] || isNaN(input[i]))
            input[i] = "";
    }

    let i = input.length - 1;

    while (i >= 0 && (input[i] === template[i] || input[i] === "")) {
        input.pop();        
        i--;
    }

    input = input.join("+");

    return input
}

function add(type, state, x, y, z, data, id) {

    x = round(x);
    y = round(y);
    z = round(z);

    if (state == 0)
        state = "";
    if (x == 0)
        x = "";
    if (y == 0)
        y = "";
    if (z == 0)
        z = "";
    if (!Array.isArray(data))
        data = [data];
    
    if (typeof type === "string")
        type = type.toLowerCase();

    switch(type) {
        case 0: case "nor": case "not": type = 0; data = ""; break;
        case 1: case "and": type = 1; data = ""; break;
        case 2: case "or": type = 2; data = ""; break;
        case 3: case "xor": type = 3; data = ""; break;
        case 4: case "button": type = 4; data = ""; break;
        case 5: case "tff": type = 5;

            data = data.map(Math.floor);
            
            data[0] = data[0]%2;
            data[1] = data[1]%2;

            data = format([0, 0], data);

            break;

        case 6: case "led": type = 6;

            data = data.map(Math.floor);

            data[0] = Math.max(Math.min(data[0], 255), 0);
            data[1] = Math.max(Math.min(data[1], 255), 0);
            data[2] = Math.max(Math.min(data[2], 255), 0);
            data[3] = Math.max(Math.min(data[3], 100), 5);
            data[4] = Math.max(Math.min(data[4], 100), 5);
            data[5] = Math.max(Math.min(data[5], 1), 0);

            data = format([175, 175, 175, 100, 25, 0], data);

            break;

        case 7: case "note": type = 7;

            data[1] = Math.floor(data[1]);

            data[0] = Math.max(Math.min(data[0], 16000), 0);
            data[1] = Math.max(Math.min(data[1], 5), 0);

            data = format([329.63, 0], data);
            
            break;

        case 8: case "conductor": type = 8; data = []; break;
        case 9: case "custom": type = 9; data = []; break;
        case 10: case "nand": type = 10; data = []; break;
        case 11: case "xnor": type = 11; data = []; break;
        case 12: case "random": type = 12;

            data[0] = Math.max(Math.min(data[0], 1), 0);

            data = format([0.5], data);
        
            break;

        case 13: case "text": type = 13;

            if (typeof data[0] === "string") {
                data[0] = data[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L").charCodeAt();
            }

            data = data.map(Math.floor);

            data[0] = Math.max(Math.min(data[0], 126), 32);

            data = format([65], data);


            break;
        
        case 14: case "tile": type = 14;

            data = data.map(Math.floor);

            data[0] = Math.max(Math.min(data[0], 255), 0);
            data[1] = Math.max(Math.min(data[1], 255), 0);
            data[2] = Math.max(Math.min(data[2], 255), 0);

            data[3] = Math.max(Math.min(data[3], 13), 1);
            data[4] = Math.max(Math.min(data[4], 1), 0);

            data = format([75, 75, 75, 1, 0], data);

            break;

        case 15: case "node": type = 15; break;
        case 16: case "delay": type = 16;

            data = data.map(Math.floor);

            data[0] = Math.max(Math.min(data[0], 1000), 1);

            data = format([20], data);

            break;

        case 17: case "antenna": type = 17;

            switch(data[1]) {
                case "local": data[1] = 0; break;
                case "global": data[1] = 1; break;
            }

            data = data.map(Math.floor);

            data[0] = Math.max(Math.min(data[0], 65535), 0);
            data[1] = Math.max(Math.min(data[1], 1), 0);

            data = format([0, 0], data);

            break;

        case 18: case "conductor2": type = 18; break;
        case 19: case "ledmixer": type = 19;

            data = data.map(Math.floor);

            data[0] = Math.max(Math.min(data[0], 1), 0);

            data = format([0], data);

            break;
    }

    x += xOffset;
    y += yOffset;
    z += zOffset;

    blocks.push({
        type,
        state,
        x, y, z,
        data,
        id
    });

    if (blocks.length >= 150000) {
        alert("Cannot place more than 150k blocks!");
        throw new Error("Cannot place more than 150k blocks!");
    }

    return blocks.length;
}

function connect(start, end) {

    if (start == "first")
        start = 1;
    if (end == "first")
        end = 1;
    if (start == "last")
        start = blocks.length;
    if (end == "last")
        end = blocks.length;

    if (!Number.isInteger(start))
        start = 1 + blocks.findIndex(block => block.id === start);
    if (!Number.isInteger(end))
        end = 1 + blocks.findIndex(block => block.id === end);

    if (start <= 0)
        throw new Error(`${start} is not a valid connection index`);
    if (end <= 0)
        throw new Error(`${end} is not a valid connection index`);

    connections.push({
        start, end
    });

    if (connections.length >= 75000) {
        alert("Cannot place more than 75k connections!");
        throw new Error("Cannot place more than 75k connections!");
    }
}

async function getString() {

    const copyfail = document.getElementById("copyfail");
    copyfail.innerHTML = "";

    let string = "";

    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        string += `${block.type},${block.state},${block.x},${block.y},${block.z},${block.data}`;

        if (i + 1 < blocks.length)
            string += ";";
    }

    string += "?";

    for (let i = 0; i < connections.length; i++) {
        let connection = connections[i]
        string += `${connection.start},${connection.end}`;

        if (i + 1 < connections.length)
            string += ";";
    }

    try {
        await navigator.clipboard.writeText(string);
    } catch {

        const p = document.createElement("p");
        p.textContent = "Couldn't automatically copy to clipboard. Instead, copy it manually from here:";

        const text = document.createElement("textarea");
        text.value = string;
        text.readOnly = true;

        copyfail.appendChild(p);
        copyfail.appendChild(text);
    }
}
