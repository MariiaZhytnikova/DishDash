package storage

import (
	"DishDash/src/models"
	"DishDash/src/utils"
)

func LoadFridge() (models.Fridge, error) {
	path, err := utils.FridgePath()
	if err != nil {
		return models.Fridge{}, err
	}

	fridge := models.Fridge{}
	err = utils.LoadJSON(path, &fridge)
	return fridge, err
}

func SaveFridge(fridge models.Fridge) error {
	path, err := utils.FridgePath()
	if err != nil {
		return err
	}
	return utils.SaveJSON(path, fridge)
}

func GetSection(name string) string {
	fridge, err := LoadFridge()
	if err != nil {
		return "rare"
	}

	name = utils.Normalize(name)

	for _, ing := range fridge.Fresh {
		if utils.Normalize(ing.Name) == name {
			return "fresh"
		}
	}

	for _, ing := range fridge.Pantry {
		if utils.Normalize(ing.Name) == name {
			return "pantry"
		}
	}

	for _, ing := range fridge.Rare {
		if utils.Normalize(ing.Name) == name {
			return "rare"
		}
	}

	return "rare"
}