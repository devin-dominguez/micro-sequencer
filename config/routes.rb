Rails.application.routes.draw do
  root to: 'static_pages#root'


  namespace :api, defaults: {format: :json} do
    resource :session, only: [:create, :destroy]
    get 'session/current', to: 'sessions#current'
    resources :users, only: [:create, :update]
    resources :compositions, only: [:index, :show, :create]
      patch 'compositions/', to: 'compositions#update'
      delete 'compositions/', to: 'compositions#destroy'
  end

end
