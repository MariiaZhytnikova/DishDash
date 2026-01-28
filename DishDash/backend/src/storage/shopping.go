package storage

import (
	"DishDash/src/models"
	"DishDash/src/utils"
)

func LoadShopping() (models.ShoppingList, error) {
	path, err := utils.ShoppingPath()
	if err != nil {
		return models.ShoppingList{}, err
	}

	var list models.ShoppingList
	if err := utils.LoadJSON(path, &list); err != nil {
		// if file empty or not found -> return empty list
		return models.ShoppingList{Items: []models.Ingredient{}}, nil
	}

	return list, nil
}

func SaveShopping(list models.ShoppingList) error {
	path, err := utils.ShoppingPath()
	if err != nil {
		return err
	}
	return utils.SaveJSON(path, list)
}

func mergeIngredients(existing []models.Ingredient, add models.Ingredient) []models.Ingredient {
	for i, ing := range existing {
		if utils.Normalize(ing.Name) == utils.Normalize(add.Name) &&
			ing.Unit == add.Unit {
			existing[i].Quantity += add.Quantity
			return existing
		}
	}
	return append(existing, add)
}

func AddToShopping(items ...models.Ingredient) error {
	list, err := LoadShopping()
	if err != nil {
		return err
	}

	for _, ing := range items {
		list.Items = mergeIngredients(list.Items, ing)
	}

	return SaveShopping(list)
}

func SetShoppingIngredient(ing models.Ingredient) error {
	list, err := LoadShopping()
	if err != nil {
		return err
	}

	found := false
	for i, it := range list.Items {
		if utils.Normalize(it.Name) == utils.Normalize(ing.Name) {
			list.Items[i].Quantity = ing.Quantity
			list.Items[i].Unit = ing.Unit
			found = true
			break
		}
	}

	if !found {
		list.Items = append(list.Items, ing)
	}

	return SaveShopping(list)
}

func RemoveFromShopping(name string) error {
	list, err := LoadShopping()
	if err != nil {
		return err
	}

	newItems := []models.Ingredient{}
	for _, ing := range list.Items {
		if utils.Normalize(ing.Name) != utils.Normalize(name) {
			newItems = append(newItems, ing)
		}
	}

	list.Items = newItems
	return SaveShopping(list)
}

func ClearShopping() error {
	list := models.ShoppingList{Items: []models.Ingredient{}}
	return SaveShopping(list)
}

func CreateShopping(list models.ShoppingList) error {
	return SaveShopping(list)
}

func LoadShoppingList() (models.ShoppingList, error) {
	path, err := utils.ShoppingPath()
	if err != nil {
		return models.ShoppingList{}, err
	}

	var list models.ShoppingList
	if err := utils.LoadJSON(path, &list); err != nil {
		return models.ShoppingList{}, err
	}
	return list, nil
}