module.exports = (config) => {
  config.addPassthroughCopy('src/css');
  config.addPassthroughCopy('src/images');
  config.addPassthroughCopy('src/js');

  return {
    dir: {
      input: 'src',
    },
  };
};
