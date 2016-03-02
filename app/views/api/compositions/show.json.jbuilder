if @composition.public ||
  (current_user && @composition.user_id === current_user.id)
  json.partial! 'api/compositions/composition', composition: @composition, get_data: true
end
