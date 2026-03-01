package storage

import (
	"os"
	"errors"

	"DishDash/internal/models"
	"DishDash/internal/utils"
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

func AddPosition(section string, ing models.Ingredient) error {
	fridge, err := LoadFridge()
	if err != nil {
		return errors.New("failed load fridge")
	}

	// check in all sections
	// if utils.HasIngredient(fridge.Fresh, ing) ||
	// utils.HasIngredient(fridge.Pantry, ing) ||
	// utils.HasIngredient(fridge.Rare, ing) {
	// 	return errors.New("ingredient already exists")
	// }

	// add to chosen section
	switch section {
	case "fresh":
		fridge.Fresh = append(fridge.Fresh, ing)
	case "pantry":
		fridge.Pantry = append(fridge.Pantry, ing)
	case "rare":
		fridge.Rare = append(fridge.Rare, ing)
	default:
		return errors.New("unknown section")
	}

	return SaveFridge(fridge)
}

func DeletePosition(section string, name string) error {
	fridge, err := LoadFridge()
	if err != nil {
		return err
	}

	switch section {
	case "fresh":
		for i, f := range fridge.Fresh {
			if utils.Normalize(f.Name) == utils.Normalize(name) {
				fridge.Fresh = append(fridge.Fresh[:i], fridge.Fresh[i+1:]...)
				return SaveFridge(fridge)
			}
		}

	case "pantry":
		for i, f := range fridge.Pantry {
			if utils.Normalize(f.Name) == utils.Normalize(name) {
				fridge.Pantry = append(fridge.Pantry[:i], fridge.Pantry[i+1:]...)
				return SaveFridge(fridge)
			}
		}

	case "rare":
		for i, f := range fridge.Rare {
			if utils.Normalize(f.Name) == utils.Normalize(name) {
				fridge.Rare = append(fridge.Rare[:i], fridge.Rare[i+1:]...)
				return SaveFridge(fridge)
			}
		}

	default:
		return errors.New("unknown section")
	}

	return errors.New("ingredient not found")
}


func Increase(section, name string, qty float64) error {
	fridge, err := LoadFridge()
	if err != nil {
		return err
	}

	switch section {
	case "fresh":
		for i, f := range fridge.Fresh {
			if utils.Normalize(f.Name) == utils.Normalize(name) {
				fridge.Fresh[i].Quantity += qty
				return SaveFridge(fridge)
			}
		}
	case "pantry":
		for i, f := range fridge.Pantry {
			if utils.Normalize(f.Name) == utils.Normalize(name) {
				fridge.Pantry[i].Quantity += qty
				return SaveFridge(fridge)
			}
		}
	case "rare":
		for i, f := range fridge.Rare {
			if utils.Normalize(f.Name) == utils.Normalize(name) {
				fridge.Rare[i].Quantity += qty
				return SaveFridge(fridge)
			}
		}
	default:
		return errors.New("unknown section")
	}

	return errors.New("ingredient not found")
}

func Decrease(section, name string, qty float64) error {
	fridge, err := LoadFridge()
	if err != nil {
		return err
	}

	switch section {
	case "fresh":
		for i, f := range fridge.Fresh {
			if utils.Normalize(f.Name) == utils.Normalize(name) {
				fridge.Fresh[i].Quantity -= qty
				if fridge.Fresh[i].Quantity < 0 {
					fridge.Fresh[i].Quantity = 0
				}
				return SaveFridge(fridge)
			}
		}
	case "pantry":
		for i, f := range fridge.Pantry {
			if utils.Normalize(f.Name) == utils.Normalize(name) {
				fridge.Pantry[i].Quantity -= qty
				if fridge.Pantry[i].Quantity < 0 {
					fridge.Pantry[i].Quantity = 0
				}
				return SaveFridge(fridge)
			}
		}
	case "rare":
		for i, f := range fridge.Rare {
			if utils.Normalize(f.Name) == utils.Normalize(name) {
				fridge.Rare[i].Quantity -= qty
				if fridge.Rare[i].Quantity < 0 {
					fridge.Rare[i].Quantity = 0
				}
				return SaveFridge(fridge)
			}
		}
	default:
		return errors.New("unknown section")
	}

	return errors.New("ingredient not found")
}

func IncreaseList(list []models.Ingredient) error {
	fridge, err := LoadFridge()
	if err != nil {
		return err
	}

	for _, ing := range list {
		if tryIncrease(&fridge.Fresh, ing) {
			continue
		}
		if tryIncrease(&fridge.Pantry, ing) {
			continue
		}

		// not found → add to rare
		fridge.Rare = append(fridge.Rare, ing)
	}

	return SaveFridge(fridge)
}

func DecreaseList(list []models.Ingredient) error {
	fridge, err := LoadFridge()
	if err != nil {
		return err
	}

	for _, ing := range list {
		if tryDecrease(&fridge.Fresh, ing) {
			continue
		}
		if tryDecrease(&fridge.Pantry, ing) {
			continue
		}
		tryDecrease(&fridge.Rare, ing)
	}

	return SaveFridge(fridge)
}

func tryIncrease(section *[]models.Ingredient, ing models.Ingredient) bool {
	for i, f := range *section {
		if utils.Normalize(f.Name) == utils.Normalize(ing.Name) {
			(*section)[i].Quantity += ing.Quantity
			return true
		}
	}
	return false
}

func tryDecrease(section *[]models.Ingredient, ing models.Ingredient) bool {
	for i, f := range *section {
		if utils.Normalize(f.Name) == utils.Normalize(ing.Name) {
			(*section)[i].Quantity -= ing.Quantity
			if (*section)[i].Quantity < 0 {
				(*section)[i].Quantity = 0
			}
			return true
		}
	}
	return false
}
