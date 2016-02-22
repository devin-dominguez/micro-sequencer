# API Endpoints

## JSON API

### Users

- `GET /api/users/new`
- `POST /api/users`
- `PATCH /api/users`

### Session

- `GET /api/session/new`
- `POST /apisession`
- `DELETE /api/session`

### Compositions

- `GET /api/compositions`
  - Compositions index/search
  - can search by `title`, `user`, `tag_name`
  - can search in `current_user`, `favorites`, `all public`
- `POST /api/compositions`
- `GET /api/composition/:id`
- `PATCH /api/composition/:id`
- `DELETE /api/composition/:id`

### Tags

- `POST /api/composition/:composition_id/tags`
- `DELETE /api/composition/:composition_id/tags/:tag_name`

### Favorites

- `POST /api/user/:user_id/favorites`
- `DELETE /api/user/:user_id/favorites/:composition_id`
