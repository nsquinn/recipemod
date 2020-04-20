const useState = React.useState;
const useEffect = React.useEffect;

async function getData(url) {
  const response = await fetch(url);
  return await response.json();
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

function AddRecipeBox(props) {
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: props.handleSubmitRecipe,
    className: "needs-validation mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("input", {
    type: "url",
    onChange: props.handleAddURLChange,
    className: "form-control form-control-lg",
    placeholder: "Enter link to recipe",
    name: "url",
    required: true
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Add Recipe"));
}

function RecipeCard(props) {
  const recipe = props.recipe;
  return /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, recipe.image_url ? /*#__PURE__*/React.createElement("img", {
    className: "card-img-top",
    src: recipe.image_url,
    alt: "Recipe image"
  }) : null, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "recipe-name"
  }, recipe.name), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-secondary small recipe-domain"
  }, "(", recipe.domain, ")")), /*#__PURE__*/React.createElement("p", {
    className: "card-text font-italic small"
  }, recipe.description && recipe.description.length > 150 ? recipe.description.slice(0, 150).trim() + "..." : recipe.description), /*#__PURE__*/React.createElement("a", {
    href: recipe.id + "/view",
    className: "btn btn-primary stretched-link"
  }, "View")));
}

function RecipeCardColumns(props) {
  const recipeCards = props.recipes.map(recipe => /*#__PURE__*/React.createElement(RecipeCard, {
    key: recipe.id,
    recipe: recipe
  }));
  return /*#__PURE__*/React.createElement("div", {
    id: "recipe-cards",
    className: "card-columns"
  }, recipeCards);
}

function SearchBox(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "input-group mb-3"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "filterByName",
    type: "text",
    placeholder: "Filter by name",
    value: props.nameFilterText,
    onChange: props.handleNameFilterChange
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "filterByDomain",
    type: "text",
    placeholder: "Filter by site",
    value: props.siteFilterText,
    onChange: props.handleSiteFilterChange
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-danger ml-1",
    id: "resetFilters",
    onClick: props.handleFilterReset
  }, "Reset"));
}

function RecipeTable() {
  let [recipes, setRecipes] = useState([]);
  useEffect(() => {
    getData("/api/recipes").then(data => {
      data.forEach(recipe => {
        recipe.domain = new URL(recipe.url).hostname;
      });
      setRecipes(data);
    });
  }, []);
  const [nameFilterText, setNameFilterText] = useState('');

  function handleNameFilterChange(event) {
    setNameFilterText(event.target.value);
  }

  if (nameFilterText) {
    let lowerFilterText = nameFilterText.toLowerCase();
    recipes = recipes.filter(recipe => recipe.name.toLowerCase().search(lowerFilterText) > -1);
  }

  const [addRecipeUrlText, setAddRecipeURLText] = useState('');

  function handleAddURLChange(event) {
    setAddRecipeURLText(event.target.value);
  }

  const [siteFilterText, setSiteFilterText] = useState('');

  function handleSiteFilterChange(event) {
    setSiteFilterText(event.target.value);
  }

  if (siteFilterText) {
    let lowerFilterText = siteFilterText.toLowerCase();
    recipes = recipes.filter(recipe => recipe.domain.search(lowerFilterText) > -1);
  }

  function handleSubmitRecipe(event) {
    let url = addRecipeUrlText;
    postData('/api/recipes/add', {
      url: url
    }).then(recipe => {
      setRecipes([recipe].concat(recipes));
    });
    event.preventDefault();
  }

  function handleFilterReset() {
    setSiteFilterText('');
    setNameFilterText('');
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AddRecipeBox, {
    handleAddURLChange: handleAddURLChange,
    handleSubmitRecipe: handleSubmitRecipe
  }), /*#__PURE__*/React.createElement(SearchBox, {
    nameFilterText: nameFilterText,
    siteFilterText: siteFilterText,
    handleNameFilterChange: handleNameFilterChange,
    handleSiteFilterChange: handleSiteFilterChange,
    handleFilterReset: handleFilterReset
  }), /*#__PURE__*/React.createElement(RecipeCardColumns, {
    recipes: recipes
  }));
}

class RecipeTableClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      nameFilterText: '',
      siteFilterText: '',
      addRecipeUrlText: ''
    };
    this.getRecipes = this.getRecipes.bind(this);
    this.handleNameFilterChange = this.handleNameFilterChange.bind(this);
    this.handleSiteFilterChange = this.handleSiteFilterChange.bind(this);
    this.handleFilterReset = this.handleFilterReset.bind(this);
    this.handleAddURLChange = this.handleAddURLChange.bind(this);
    this.handleSubmitRecipe = this.handleSubmitRecipe.bind(this);
  }

  handleNameFilterChange(event) {
    this.setState({
      nameFilterText: event.target.value
    });
  }

  handleSiteFilterChange(event) {
    this.setState({
      siteFilterText: event.target.value
    });
  }

  handleFilterReset(event) {
    this.setState({
      siteFilterText: '',
      nameFilterText: ''
    });
  }

  handleAddURLChange(event) {
    let urlValue = event.target.value;
    console.log('Typed this: ', urlValue);
    this.setState({
      addRecipeUrlText: urlValue
    });
  }

  handleSubmitRecipe(event) {
    let url = this.state.addRecipeUrlText;
    console.log('To add this:', url);
    let recipes = this.state.recipes;
    postData('/api/recipes/add', {
      url: url
    }).then(recipe => {
      this.setState({
        recipes: [recipe].concat(recipes)
      });
    });
    event.preventDefault();
  }

  getRecipes() {
    getData("/api/recipes").then(data => {
      data.forEach(recipe => {
        recipe.domain = new URL(recipe.url).hostname;
      });
      this.setState({
        recipes: data
      });
    });
  }

  componentDidMount() {
    this.getRecipes();
  }

  render() {
    let recipes = this.state.recipes;
    const nameFilterText = this.state.nameFilterText;

    if (nameFilterText) {
      recipes = recipes.filter(recipe => recipe.name.toLowerCase().search(nameFilterText.toLowerCase()) > -1);
    }

    const siteFilterText = this.state.siteFilterText;

    if (siteFilterText) {
      recipes = recipes.filter(recipe => recipe.domain.search(siteFilterText.toLowerCase()) > -1);
    }

    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AddRecipeBox, {
      handleAddURLChange: this.handleAddURLChange,
      handleSubmitRecipe: this.handleSubmitRecipe
    }), /*#__PURE__*/React.createElement(SearchBox, {
      nameFilterText: this.state.nameFilterText,
      siteFilterText: this.state.siteFilterText,
      handleNameFilterChange: this.handleNameFilterChange,
      handleSiteFilterChange: this.handleSiteFilterChange,
      handleFilterReset: this.handleFilterReset
    }), /*#__PURE__*/React.createElement(RecipeCardColumns, {
      recipes: recipes
    }));
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(RecipeTable, null), document.getElementById('react-recipe-container'));