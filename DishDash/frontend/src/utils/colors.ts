// Helper function to get meal type colors
export const getMealTypeColors = (mealType: string): { bgColor: string; textColor: string } => {
  const normalizedMealType = mealType.toLowerCase();
  
  if (normalizedMealType.includes('lunch')) {
    return { bgColor: '#faedfc', textColor: '#ad0fc9' };
  } else if (normalizedMealType.includes('dinner')) {
    return { bgColor: '#fef3c6', textColor: '#973C00' };
  } else if (normalizedMealType.includes('snack')) {
    return { bgColor: '#fee2e2', textColor: '#991b1b' };
  } else if (normalizedMealType.includes('breakfast')) {
    return { bgColor: '#dbeafe', textColor: '#1e40af' };
  } else {
    return { bgColor: '#dcfce7', textColor: '#016630' };
  }
};
