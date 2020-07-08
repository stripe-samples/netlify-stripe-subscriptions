const content = {
  free: {
    src:
      'https://images.unsplash.com/photo-1550159930-40066082a4fc?auto=format&fit=crop&w=600&h=600&q=80',
    alt: 'corgi in the park with a sunset in the background',
    credit: 'Jacob Van Blarcom',
    creditLink: 'https://unsplash.com/photos/lkzjENdWgd8',
    message: 'To view this content, you need to create an account!',
    allowedRoles: ['free', 'pro', 'premium'],
  },
  pro: {
    src:
      'https://images.unsplash.com/photo-1519098901909-b1553a1190af?auto=format&fit=crop&w=600&h=600&q=80',
    alt: 'close-up of a corgi with its tongue hanging out',
    credit: 'Florencia Potter',
    creditLink: 'https://unsplash.com/photos/yxmNWxi3wCo',
    message:
      'This is protected content! It’s only available if you have a pro plan or higher.',
    allowedRoles: ['pro', 'premium'],
  },
  premium: {
    src:
      'https://images.unsplash.com/photo-1546975490-e8b92a360b24?auto=format&fit=crop&w=600&h=600&q=80',
    alt: 'corgi in a tent with string lights in the foreground',
    credit: 'Cole Keister',
    creditLink: 'https://unsplash.com/photos/cX-KEISwDIw',
    message:
      'This is protected content! It’s only available if you have the premium plan.',
    allowedRoles: ['premium'],
  },
};

exports.handler = async (event, context) => {
  const { type } = JSON.parse(event.body);
  const { user } = context.clientContext;
  const roles = user ? user.app_metadata.roles : false;
  const { allowedRoles } = content[type];

  if (!roles || !roles.some((role) => allowedRoles.includes(role))) {
    return {
      statusCode: 402,
      body: JSON.stringify({
        src:
          'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto/v1592618179/stripe-subscription/subscription-required.jpg',
        alt: 'corgi in a crossed circle with the text “subscription required”',
        credit: 'Jason Lengstorf',
        creditLink: 'https://dribbble.com/jlengstorf',
        message: `This content requires a ${type} subscription.`,
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(content[type]),
  };
};
