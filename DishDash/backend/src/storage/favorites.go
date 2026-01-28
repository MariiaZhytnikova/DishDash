package storage

import (
	"DishDash/src/models"
	"DishDash/src/utils"
)

func LoadFavorites() ([]models.Favorite, error) {
	path, err := utils.FavoritesPath()
	if err != nil {
		return nil, err
	}

	var favs []models.Favorite
	if err := utils.LoadJSON(path, &favs); err != nil {
		return nil, err
	}
	return favs, nil
}

func SaveFavorites(favs []models.Favorite) error {
	path, err := utils.FavoritesPath()
	if err != nil {
		return err
	}
	return utils.SaveJSON(path, favs)
}

func AddFavorite(fav models.Favorite) error {
	favs, err := LoadFavorites()
	if err != nil {
		return err
	}

	// Prevent duplicates
	for _, f := range favs {
		if f.ID == fav.ID {
			return nil
		}
	}

	favs = append(favs, fav)
	return SaveFavorites(favs)
}

func RemoveFavorite(id int) error {
	favs, err := LoadFavorites()
	if err != nil {
		return err
	}

	newFavs := []models.Favorite{}
	for _, f := range favs {
		if f.ID != id {
			newFavs = append(newFavs, f)
		}
	}

	return SaveFavorites(newFavs)
}