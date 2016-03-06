Rails.application.routes.draw do
  root to: 'static_pages#root'


  namespace :api, defaults: {format: :json} do
    resource :session, only: [:create, :destroy]
    get 'session/current', to: 'sessions#current'
    resources :users, only: [:create, :update]
    resources :compositions, only: [:index, :show, :create, :destroy]
      patch 'compositions/', to: 'compositions#update'
  end

end
