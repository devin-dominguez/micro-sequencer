class Api::SessionsController < ApplicationController

  def create
    username = user_params[:username]
    password = user_params[:password]
    user = User.find_by_credentials(username, password)

    if user
      log_in!(user)
    else
      render json: ["User Not Found"], status: :not_found
    end
  end

  def current
  end

  def destroy
    log_out!
    render json: ["logged out"], status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:username, :password)
  end
end
