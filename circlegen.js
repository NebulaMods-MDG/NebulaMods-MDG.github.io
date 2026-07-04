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

    if(
        isNaN(radius)
        || radius < 1
    )
    {
        alert(
            "Invalid radius."
        );

        return;
    }

    const points = [];
    const used = new Set();

    function add(x,z)
    {
        const key =
            `${x},${z}`;

        if(
            used.has(key)
        )
            return;

        used.add(key);

        points.push({
            x,
            z,
            angle:
                Math.atan2(
                    z,
                    x
                )
        });
    }

    let x = radius;
    let z = 0;

    let d =
        1 - radius;

    while(
        x >= z
    )
    {
        add( x,  z);
        add( z,  x);

        add(-z,  x);
        add(-x,  z);

        add(-x, -z);
        add(-z, -x);

        add( z, -x);
        add( x, -z);

        z++;

        if(d < 0)
        {
            d +=
                2*z + 1;
        }
        else
        {
            x--;

            d +=
                2*(z-x)+1;
        }
    }

    points.sort(

        (a,b)=>

        a.angle-b.angle

    );

    if(
        points.length >
        MAX_BLOCKS
    )
    {
        alert(
            "Too many blocks."
        );

        return;
    }

    const blocks =
        [];

    for(
        const p
        of points
    )
    {
        blocks.push(

`${block},0,${-p.x},0,${p.z},`

        );
    }

    let result =
        blocks.join(";");

    result += "?";

    const connections =
        [];

    for(
        let i = 1;
        i <= points.length;
        i++
    )
    {
        let next =
            i + 1;

        if(
            next >
            points.length
        )
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

    copy(
        result
    );
}
