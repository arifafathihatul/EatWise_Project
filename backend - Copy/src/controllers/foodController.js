export function getAllFoods(req, res) {
  res.status(200).json({
    success: true,
    message: 'Foods retrieved successfully',
    data: req.app.locals.foods
  });
}

export function searchFoods(req, res) {
  const { name } = req.query;
  const foods = req.app.locals.foods;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Query parameter name is required'
    });
  }

  const results = foods.filter((food) =>
    food.name.toLowerCase().includes(name.toLowerCase())
  );

  res.status(200).json({
    success: true,
    message: 'Search results retrieved successfully',
    data: results
  });
}