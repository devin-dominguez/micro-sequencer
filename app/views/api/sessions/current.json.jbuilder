user = current_user
unless user.nil?
  json.partial! 'api/users/user', user: user
else
  json.nullUser true
end

