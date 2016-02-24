json.array! @compositions do |composition|
  next unless composition.public ||
    (current_user && composition.user_id === current_user.id)
  json.partial! 'api/compositions/composition', composition: composition, get_data: false
end
