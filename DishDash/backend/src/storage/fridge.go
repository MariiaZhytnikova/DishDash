package storage

import (
	"os"

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
	if err != nil {
		if os.IsNotExist(err) {
			fridge = models.Fridge{
				Fresh:  []models.Ingredient{},
				Pantry: []models.Ingredient{},
				Rare:   []models.Ingredient{},
			}
			if saveErr := SaveFridge(fridge); saveErr != nil {
				return models.Fridge{}, saveErr
			}
			return fridge, nil
		}
		return models.Fridge{}, err
	}

	modified := false
	if fridge.Fresh == nil {
		fridge.Fresh = []models.Ingredient{}
		modified = true
	}
	if fridge.Pantry == nil {
		fridge.Pantry = []models.Ingredient{}
		modified = true
	}
	if fridge.Rare == nil {
		fridge.Rare = []models.Ingredient{}
		modified = true
	}

	if modified {
		if err := SaveFridge(fridge); err != nil {
			return models.Fridge{}, err
		}
	}

	return fridge, nil
}

func SaveFridge(fridge models.Fridge) error {
	path, err := utils.FridgePath()
	if err != nil {
		return err
	}
	return utils.SaveJSON(path, fridge)

}

func GetSection(name string) (string, error) {
	fridge, err := LoadFridge()
	if err != nil {
		return "", err
	}

	name = utils.Normalize(name)

	for _, ing := range fridge.Fresh {
		if utils.Normalize(ing.Name) == name {
			return "fresh", nil
		}
	}

	for _, ing := range fridge.Pantry {
		if utils.Normalize(ing.Name) == name {
			return "pantry", nil
		}
	}

	for _, ing := range fridge.Rare {
		if utils.Normalize(ing.Name) == name {
			return "rare", nil
		}
	}

	return "rare", nil
}