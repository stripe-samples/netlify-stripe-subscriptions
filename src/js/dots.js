const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 56;
const X_SPACING = 28;
const Y_SPACING = 14;
const MAX_WIDTH = CANVAS_WIDTH + X_SPACING * 2;
const MAX_HEIGHT = CANVAS_HEIGHT + Y_SPACING * 2;
const COLUMN_COUNT = MAX_WIDTH / X_SPACING;
const ROW_COUNT = MAX_HEIGHT / Y_SPACING;
const OFFSET_DISTANCE = 0.05;

/*
 * To keep track of which circle has what opacity, we need to give each one a
 * unique key. Fortunately, we have row and column numbers, which combine to
 * make a unique value for each circle!
 *
 * This function starts each circle out at a random opacity, then increments
 * the value by 0.01 going either up or down depending on its current value.
 *
 * This causes a slow flicker from almost completely transparent to almost
 * completely opaque that’s randomized enough to look interesting.
 */
const opacityMap = new Map();
function getCircleOpacity(row, col) {
  const key = `${row},${col}`;
  const { opacity, direction } = opacityMap.has(key)
    ? opacityMap.get(key)
    : { opacity: Math.random(), direction: (col + row) % 2 ? 1 : -1 };

  const nextValue = opacity + 0.01 * direction;

  // make sure the value is always between 0 and 1
  const nextOpacity = Math.max(0, Math.min(1, nextValue));

  // if we went out of bounds, reverse the direction of the animation.
  const nextDirection = nextValue > 1 || nextValue < 0 ? -direction : direction;

  opacityMap.set(key, { opacity: nextOpacity, direction: nextDirection });

  return nextOpacity;
}

let offset = 0;
function drawCircles() {
  const ctx = document.querySelector('#canvas').getContext('2d');
  ctx.save();

  // for each loop, remove any existing shapes
  ctx.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);

  // bump the canvas back by the spacing amount keep our math a bit cleaner
  ctx.translate(-X_SPACING, -Y_SPACING);

  // update the offset to move everything one tick over from its previous spot
  offset += OFFSET_DISTANCE;

  for (let row = 1; row <= ROW_COUNT; row++) {
    // this gives the pattern its diagonal look
    const rowBump = row % 2 ? Y_SPACING : 0;

    // figure out how far from the top this row should be
    const newPosition = (row * Y_SPACING - offset) % MAX_HEIGHT;
    const y = newPosition < 0 ? newPosition + MAX_HEIGHT : newPosition;

    for (let col = 0; col <= COLUMN_COUNT; col++) {
      const opacity = getCircleOpacity(row, col);

      // figure out the horizontal position for this circle
      const x = (col * X_SPACING + offset * 2 + rowBump) % MAX_WIDTH;

      // draw the circle on the canvas
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2, true);
      ctx.fillStyle = `rgba(26, 42, 59, ${opacity})`;
      ctx.fill();
    }
  }

  ctx.restore();
}

export const startAnimation = () => {
  // use an interval because this doesn’t need to run every frame
  setInterval(drawCircles, 50);
};
