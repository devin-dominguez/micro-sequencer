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
    @composition = Composition.new(composition_params)
    if current_user
      @composition.user_id = current_user.id
    else
      render json: ["forbidden"], status: :forbidden
    end

    if @composition.id
      @composition.original = @composition.id
      @composition.id = nil
    end

    if @composition.save
      render :show
    else
      render json: ["something went really wrong"],
        status: :unprocessable_entity
    end
  end


  private

  def composition_params
    params.require(:composition).permit(:title, :public, :composition)
  end
end
