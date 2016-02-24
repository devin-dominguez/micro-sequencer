class CreateCompositions < ActiveRecord::Migration
  def change
    create_table :compositions do |t|
      t.string :title, null: false
      t.integer :user_id, null: false
      t.text :composition, null: false
      t.boolean :public, default: true
      t.integer :original

      t.timestamps null: false
    end
    add_index :compositions, :user_id
    add_index :compositions, :original
  end
end
