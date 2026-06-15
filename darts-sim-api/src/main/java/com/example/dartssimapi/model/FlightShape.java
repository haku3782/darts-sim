package com.example.dartssimapi.model;

/**
 * ダーツのフライト形状と、それに対応する投影面積（m²）を管理する Enum。
 * 空気抵抗の計算に使用する。
 */
public enum FlightShape {

    STANDARD (0.0040), // スタンダード
    SHAPE    (0.0033), // シェイプ
    TEARDROP (0.0035), // ティアドロップ（実測値に合わせて修正）
    KITE     (0.0028), // カイト
    SLIM     (0.0027); // スリム（実測値に合わせて修正）

    /** フライトの投影面積 (m²) */
    private final double area;

    FlightShape(double area) {
        this.area = area;
    }

    public double getArea() {
        return area;
    }
}
