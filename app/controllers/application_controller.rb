class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def current_user
    @current_user ||= User.find_by_session_token(session[:session_token])
  end

  def log_in!(user)
    session[:session_token] = user.reset_token!
    render  user, user: user
  end

  def log_out!
    user = current_user
    current_user.reset_token! unless current_user.nil?
    session[:session_token] = nil
    render user
  end
end
