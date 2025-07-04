package org.exp.primeapp.models.dto.responce.admin;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminProductDashboardRes {
    long count;
    long activeCount;
    long inactiveCount;
    List<AdminProductRes> productResList;
    List<AdminProductRes> ActiveProductResList;
    List<AdminProductRes> InactiveProductResList;
}