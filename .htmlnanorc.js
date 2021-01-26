/**
 * This file is important.
 * Prevents posthtml from striping SVGs of their viewBox property
 * See: https://gitmemory.com/issue/posthtml/posthtml/283/493249105
 */

module.exports = {
  minifySvg: false,
};
