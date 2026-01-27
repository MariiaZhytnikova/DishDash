package storage

import (
	"errors"

	"DishDash/src/models"
	"DishDash/src/utils"
)

func AddPosition(section string, ing models.Ingredient) error {
	fridge, _ := LoadFridge()

	// check in all sections
	if utils.HasIngredient(fridge.Fresh, ing) ||
	utils.HasIngredient(fridge.Pantry, ing) ||
	utils.HasIngredient(fridge.Rare, ing) {
		return errors.New("ingredient already exists")
	}

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

