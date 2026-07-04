const MAX_BLOCKS = 150000;

function copy(text)
{
    navigator.clipboard.writeText(text)
        .then(() =>
        {
            alert("Copied CM2 String!");
        })
        .catch(() =>
        {
            alert("Failed to copy.");
        });
}

function generateCircle()
{
    const radius =
        parseInt(
            document.getElementById(
                "radius"
            ).value
        );

    const block =
        parseInt(
            document.getElementById(
                "block"
            ).value
        );

    if(isNaN(radius) || radius < 1)
    {
        alert("Invalid radius.");
        return;
    }

    const points = [];
    const used = new Set();

    const count =
        Math.max(
            8,
            Math.round(
                radius * 4
            )
        );

    for(let i = 0; i < count; i++)
    {
        const angle =
            (i / count) *
            Math.PI *
            2;

        const x =
            Math.round(
                Math.cos(angle)
                * radius
            );

        const z =
            Math.round(
                Math.sin(angle)
                * radius
            );

        const key =
            `${x},${z}`;

        if(used.has(key))
            continue;

        used.add(key);

        points.push({
            x,
            z,
            angle
        });
    }

    points.sort(
        (a,b)=>
        a.angle - b.angle
    );

    let save = [];

    for(const p of points)
    {
        save.push(

`${block},0,${-p.x},0,${p.z},`

        );
    }

    let result =
        save.join(";");

    result += "?";

    const connections = [];

    for(let i = 1; i <= points.length; i++)
    {
        let next =
            i + 1;

        if(next >
            points.length)
        {
            next = 1;
        }

        connections.push(
            `${i},${next}`
        );
    }

    result +=
        connections.join(";");

    result += "???";

    navigator.clipboard.writeText(
        result
    );

    alert(
        `Copied ${points.length} blocks`
    );
}
