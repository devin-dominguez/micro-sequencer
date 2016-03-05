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
      if @composition.user_id &&
        @composition.user_id != current_user.id

        @composition.original = @composition.id
        compositions = current_user.compositions
        @composition.title += " CLONE"
        while compositions.find_by_title(@composition.title)
          @composition.title += " CLONE"
        end
      end
      @composition.user_id = current_user.id
    else
      render json: ["forbidden"], status: :forbidden
      return
    end

    if @composition.save
      render :show, status: :created
    else
      render json: ["something went really wrong"],
        status: :unprocessable_entity
    end
  end

  def update
    user_id = params[:user_id].to_i
    title = params[:composition][:title]
    if user_id != current_user.id
      render json: ["forbidden"], status: :forbidden
      return
    end
    @composition = Composition.find_by(user_id: user_id, title: title)

    unless @composition
      render json: ["not found"], status: :note_found
      return
    end

    if @composition.user_id != current_user.id
      render json: {clone: true}, status: :ok
      return
    end

    if @composition.update(composition_params)
      render :show, status: :ok
    else
      render json: ["update failed"], status: :unprocessable_entity
    end
  end


  private

  def composition_params
    params.require(:composition).permit(:user_id, :title, :public, :composition)
  end
end
