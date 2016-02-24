user = current_user
if user
  json.partial! 'api/users/user', user: user
else
  json.nullUser true
end

