package storage

import "DishDash/src/models"

func LoadFavorites() ([]models.Favorite, error) {
	var list []models.Favorite
	err := loadJSON("favorites.json", &list)
	return list, err
}

func AddFavorite(f models.Favorite) error {
	list, err := LoadFavorites()
	if err != nil {
		return err
	}
	list = append(list, f)
	return saveJSON("favorites.json", list)
}
