export function createTextLayer(font, interval, ...strings){
    const height = strings.length * font.size.y + (strings.length - 1) * interval;

    const lines = strings.map((string, index) => {
        return {
            string,
            offX: - Math.floor(string.length * font.size.x / 2),
            offY: - Math.floor(height) / 2 + (font.size.y + interval) * index
        }
    })

    return function drawText(context) {
        const centerX = Math.floor(context.canvas.width/2);
        const centerY = Math.floor(context.canvas.height/2);

        for(const line of lines) {
            font.print(line.string, context, centerX + line.offX, centerY + line.offY);
        }
    }
}
