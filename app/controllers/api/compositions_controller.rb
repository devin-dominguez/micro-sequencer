class Api::CompositionsController < ApplicationController

  def index
    if current_user && params[:own_compositions] == "true"
      @compositions = current_user.compositions
    else
      @compositions = Composition.all;
    end

    render :index
  end

  def show
    @composition = Composition.find(params[:id])
    if @composition.public ||
      (current_user && @composition.user_id === current_user.id)
        render :show
    else
      render status: :forbidden
    end
  end


  def create
    unless current_user
      render json: {errors:["not logged in"]}, status: :forbidden
    end

    @composition = Composition.new(composition_params)
    @composition.user_id = current_user.id

    if @composition.save
      render :show, status: :ok
    else
      render json: {errors:["creation failed"]}, status: :unprocessable_entity
    end
  end

  def update
    unless current_user
      render json: {errors:["not logged in"]}, status: :forbidden
      return
    end

    title = composition_params[:title]
    compositions = current_user.compositions

    @composition = compositions.find_by(title: title)
    unless @composition
      render json: {errors:["composition not found"]}, status: :not_found
      return
    end

    if @composition.update(composition_params)
      render :show
    else
      render json: {errors:["update failed"]}, status:  :unprocessable_entity
    end
  end

  private

  def composition_params
    params.require(:composition).permit(:title, :public, :composition)
  end
end
